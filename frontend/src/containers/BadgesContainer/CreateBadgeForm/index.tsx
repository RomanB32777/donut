import { Col, Row, StepProps, Steps, StepsProps } from "antd";
import { useState } from "react";
import { ethers } from "ethers";
import BaseButton from "../../../commonComponents/BaseButton";
import UploadImage from "../../../components/UploadImage";
import FormInput from "../../../components/FormInput";

import PageTitle from "../../../commonComponents/PageTitle";
import { LeftArrowIcon } from "../../../icons/icons";
import { IBadgeData, initBadgeData } from "../../../types";
import SelectInput from "../../../components/SelectInput";
import axiosClient from "../../../axiosClient";
import { useSelector } from "react-redux";
import { makeStorageClient } from "../utils";
import { abi, bytecode } from "../../../consts";
import { getMetamaskData } from "../../../functions/getTronWallet";
import ModalComponent, {
  SuccessModalComponent,
} from "../../../components/ModalComponent";
import { CheckOutlined, LoadingOutlined } from "@ant-design/icons";
import { addNotification } from "../../../utils";
import { useNavigate } from "react-router";

const { Step } = Steps;

const customDot: StepsProps["progressDot"] = (dot, { status }) => {
  if (status === "finish")
    return (
      <CheckOutlined
        style={{
          color: "#25EC39",
          position: "absolute",
          right: "-11px",
          top: "-10px",
          fontSize: 25,
        }}
      />
    );
  if (status === "process")
    return (
      <LoadingOutlined
        style={{
          color: "#1D14FF",
          position: "absolute",
          right: "-11px",
          top: "-5px",
          fontSize: 25,
        }}
      />
    );
  return dot;
};

const initLoadingSteps: StepProps[] = [
  {
    status: "wait",
    title: "Loading files to IPFS",
  },
  {
    status: "wait",
    title: "Creating ERC 1155 collection",
  },
  {
    status: "wait",
    title: "Verification",
  },
];

const CreateBadgeForm = ({
  backBtn,
}: // setActiveBadge,
// openBadgePage,
{
  backBtn: () => void;
  setActiveBadge?: (activeBadge: IBadgeData) => void;
  openBadgePage?: () => void;
}) => {
  const navigate = useNavigate();
  const user = useSelector((state: any) => state.user);
  const [loading, setLoading] = useState<boolean>(false);
  const [isOpenSuccessModal, setIsOpenSuccessModal] = useState<boolean>(false);
  const [loadingSteps, setLoadingSteps] = useState<StepProps[]>([
    ...initLoadingSteps,
  ]);

  const [formBadge, setFormBadge] = useState<IBadgeData>({
    ...initBadgeData,
  });

  const createJSON = (_title: string, _description: string, _uri: string) => {
    const dict = { title: _title, description: _description, URI: _uri };
    const jsonDict = JSON.stringify(dict);
    const file = new File([jsonDict], "metadata.json", {
      type: "text/plain;charset=utf-8",
    });
    return [file];
  };

  const storeFiles = async (_files: any) => {
    const client = makeStorageClient();
    const cid = await client.put(_files);
    console.log("stored files with cid:", cid);
    const ipfsLink = "ipfs://" + cid;
    console.log(ipfsLink);
    return ipfsLink;
  };

  const uploadToIpfs = async () => {
    const { image, title, description } = formBadge;
    if (image.file && title && description) {
      const _uri = await storeFiles([image.file]);
      const badgeDict = createJSON(title, description, _uri);
      const new_uri = await storeFiles(badgeDict);
      return new_uri;
    }
  };

  const setLoadingCurrStep = ({
    loadingStep,
    finishedStep,
  }: {
    loadingStep?: number;
    finishedStep?: number;
  }) => {
    // const loadingItem = loadingSteps.find((_, key) => key === loadingStep);
    // const finishedItem = loadingSteps.find((_, key) => key === finishedStep);
    // // console.log("load status", loadingItem, finishedItem);

    // // const res = loadingSteps.reduce((acc, currStep) => {
    // //   return [...acc, currStep];
    // // }, [] as StepProps[]);

    // // console.log(res);

    if (loadingStep === 0) {
      setLoadingSteps([
        {
          status: "process",
          title: "Loading files to IPFS",
        },
        ...loadingSteps.slice(1, 3),
      ]);
    } else if (finishedStep === 0 && loadingStep === 1) {
      setLoadingSteps((prev) => [
        {
          status: "finish",
          title: "Loading files to IPFS",
        },
        {
          status: "process",
          title: "Creating ERC 1155 collection",
        },
        ...prev.slice(2, 3),
      ]);
    } else if (finishedStep === 1 && loadingStep === 2) {
      setLoadingSteps((prev) => [
        ...prev.slice(0, 1),
        {
          status: "finish",
          title: "Creating ERC 1155 collection",
        },
        {
          status: "process",
          title: "Verification",
        },
      ]);
    } else if (finishedStep === 2) {
      setLoadingSteps((prev) => [
        ...prev.slice(0, 2),
        {
          status: "finish",
          title: "Verification",
        },
      ]);
    }
  };

  const closeSuccessPopup = () => {
    setIsOpenSuccessModal(false);
    setFormBadge({ ...initBadgeData });
    backBtn();
  };

  const createContract = async () => {
    const { image, title, description, blockchain } = formBadge;
    if (
      image.preview.length &&
      title.length &&
      description.length &&
      blockchain.length
    ) {
      try {
        setLoading(true);
        setLoadingCurrStep({ loadingStep: 0 });
        const walletData = await getMetamaskData();
        if (walletData?.address) {
          const _uri = await uploadToIpfs();
          setLoadingCurrStep({ finishedStep: 0, loadingStep: 1 });
          const provider = new ethers.providers.Web3Provider(
            (window as any).ethereum
          );
          const signer = provider.getSigner(0);
          setLoadingCurrStep({ finishedStep: 1, loadingStep: 2 });
          const Badge = new ethers.ContractFactory(abi, bytecode, signer);
          const badgeContract = await Badge.deploy(_uri); // deploy contracts
          setLoadingCurrStep({ finishedStep: 2 });

          if (badgeContract) {
            // const newBadge =
            await axiosClient.post("/api/badge/", {
              creator_id: user.id,
              contract_address: badgeContract.address,
            });
            setIsOpenSuccessModal(true);
            // setActiveBadge({
            //   contract_address: badgeContract.address,
            //   id: newBadge.data.id,
            // });
            // backBtn();
            // openBadgePage();
          }
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
        setLoadingSteps([...initLoadingSteps]);
      }
    } else {
      addNotification({
        type: "danger",
        title: "Not all fields are filled",
      });
    }
  };

  const { image, title, description, blockchain } = formBadge;

  return (
    <div className="create_badges">
      <div className="create_badges__container">
        <div className="create_badges__title">
          <div className="arrow_icon icon" onClick={backBtn}>
            <LeftArrowIcon />
          </div>
          <PageTitle formatId="create_badge_form_button" notMarginBottom />
        </div>
        <Row
          gutter={[4, 4]}
          className="create_badges__form"
          justify="space-between"
        >
          <Col span={10}>
            <div className="upload-block">
              <UploadImage
                label="Upload Image"
                formats={["PNG", "JPG"]}
                sizeStr="5 MB"
                filePreview={image.preview}
                setFile={({ preview, file }) =>
                  setFormBadge({
                    ...formBadge,
                    image: {
                      file,
                      preview,
                    },
                  })
                }
                labelCol={24}
                InputCol={24}
                bigSize
              />
            </div>
          </Col>
          <Col span={12}>
            <Row gutter={[0, 18]} className="form">
              <Col span={24}>
                <div className="form-element">
                  <FormInput
                    label="Name"
                    name="name"
                    value={title}
                    setValue={(value) =>
                      setFormBadge({ ...formBadge, title: value })
                    }
                    placeholder="Your badge name..."
                    labelCol={24}
                    InputCol={24}
                    gutter={[0, 18]}
                  />
                </div>
              </Col>
              <Col span={24}>
                <div className="form-element">
                  <FormInput
                    label="Description"
                    name="description"
                    value={description}
                    setValue={(value) =>
                      setFormBadge({ ...formBadge, description: value })
                    }
                    placeholder="Your badge description..."
                    labelCol={24}
                    InputCol={24}
                    gutter={[0, 18]}
                    isTextarea
                  />
                </div>
              </Col>
              <Col span={24}>
                <div className="form-element">
                  <SelectInput
                    value={blockchain}
                    list={["tEVMOS"]}
                    label="Blockchain"
                    placeholder="Choose blockchain"
                    setValue={(value) =>
                      setFormBadge({
                        ...formBadge,
                        blockchain: value as string,
                      })
                    }
                    labelCol={24}
                    selectCol={24}
                    gutter={[0, 18]}
                  />
                </div>
              </Col>
              <Col span={24}>
                <div className="saveBottom">
                  <BaseButton
                    title="Create contract"
                    padding="6px 35px"
                    onClick={createContract}
                    fontSize="18px"
                    disabled={loading}
                    isBlue
                  />
                </div>
              </Col>
            </Row>
          </Col>
        </Row>
      </div>
      <ModalComponent
        visible={loading}
        title="Follow steps"
        closable={false}
        width={550}
      >
        <div className="goals-modal">
          <Row gutter={[0, 18]} className="goals-modal__form" justify="center">
            <Col span={24}>
              <Steps direction="vertical" progressDot={customDot}>
                {loadingSteps.map((step, key) => (
                  <Step key={key} status={step.status} title={step.title} />
                ))}
              </Steps>
            </Col>
          </Row>
        </div>
      </ModalComponent>
      <SuccessModalComponent
        visible={isOpenSuccessModal}
        onClose={closeSuccessPopup}
        message={`Your ERC-1155 NFT Badge was created successfully!`}
        description="Usually it takes around 30-60 seconds for it to be displayed in Badges section"
      />
    </div>
  );
};

export default CreateBadgeForm;
