import { Col, Row, StepProps, Steps, StepsProps } from "antd";
import { useContext, useMemo, useState } from "react";
import BaseButton from "../../../components/BaseButton";
import UploadImage from "../../../components/UploadImage";
import FormInput from "../../../components/FormInput";

import { WebSocketContext } from "../../../components/Websocket";
import PageTitle from "../../../components/PageTitle";
import { LeftArrowIcon } from "../../../icons/icons";
import { IBadgeData, initBadgeData } from "../../../types";
import SelectInput from "../../../components/SelectInput";
import axiosClient from "../../../axiosClient";
import { useSelector } from "react-redux";
import { makeStorageClient } from "../utils";
import ModalComponent, {
  SuccessModalComponent,
} from "../../../components/ModalComponent";
import { CheckOutlined, LoadingOutlined } from "@ant-design/icons";
import { addNotification, currBlockchain, walletsConf } from "../../../utils";
import useWindowDimensions from "../../../hooks/useWindowDimensions";
import { ipfsFileformat, ipfsFilename } from "../../../consts";

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
  const socket = useContext(WebSocketContext);
  const user = useSelector((state: any) => state.user);
  const { isTablet } = useWindowDimensions();
  const [loading, setLoading] = useState<boolean>(false);
  const [isOpenSuccessModal, setIsOpenSuccessModal] = useState<boolean>(false);
  const [loadingSteps, setLoadingSteps] = useState<StepProps[]>([
    ...initLoadingSteps,
  ]);

  const [formBadge, setFormBadge] = useState<IBadgeData>({
    ...initBadgeData,
  });

  const createJSON = (title: string, description: string, _uri: string) => {
    const dict = { title, description, URI: _uri };
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
    return ipfsLink; //cid;
  };

  const uploadToIpfs = async () => {
    const { image, title, description } = formBadge;
    if (image.file && title && description) {
      const origFile = image.file;
      const sendFile = new File(
        [origFile],
        `${ipfsFilename}.${ipfsFileformat}`,
        {
          type: origFile.type,
        }
      );
      const _uri = await storeFiles([sendFile]);
      const badgeDict = createJSON(title, description, _uri);
      const new_uri = await storeFiles(badgeDict);
      console.log(new_uri);
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
        const wallet = walletsConf[process.env.REACT_APP_WALLET || "metamask"];

        const walletData = await wallet.getWalletData(
          process.env.REACT_APP_BLOCKCHAIN
        );

        if (walletData) {
          const _uri = await uploadToIpfs();

          setLoadingCurrStep({ finishedStep: 0, loadingStep: 1 });

          if (_uri) {
            const badgeContract = await wallet.createContract({
              _uri,
              abi: wallet.abi,
              bytecode: wallet.bytecode,
              setLoadingStep: setLoadingCurrStep,
            });

            if (badgeContract && badgeContract?.contract_address) {
              const transactionResult = badgeContract?.result;

              console.log(transactionResult);

              if (transactionResult && transactionResult !== "SUCCESS")
                throw new Error(transactionResult);

              const newBadge = await axiosClient.post("/api/badge/", {
                creator_id: user.id,
                contract_address: badgeContract.contract_address,
                blockchain,
                transaction_hash: badgeContract?.transaction_hash || "",
                result: transactionResult ? "success" : null, // success status here or null (if transactionResult = undefined)
              });

              if (transactionResult && newBadge.status === 200) {
                // if success status
                const newBadgeData = newBadge.data;
                const notifObj = {
                  result: transactionResult,
                  badge_id: newBadgeData.id,
                  transaction_hash: newBadgeData.transaction_hash,
                  username: user.username,
                  user_id: user.id,
                };
                socket && socket.emit("check_badge", notifObj);
              }

              setIsOpenSuccessModal(true);
            } // else ??? 
          }
        }
      } catch (error) {
        const errorMessage = (error as Error).message;
        errorMessage &&
          addNotification({
            type: "danger",
            title: errorMessage,
          });
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

  const blockchainList = useMemo(() => {
    if (currBlockchain) {
      return [
        {
          key: currBlockchain.nativeCurrency.symbol,
          value: currBlockchain.badgeName,
        },
      ];
    }
    return null;
  }, []);

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
          <Col xl={10} md={12}>
            <div className="upload-block">
              <UploadImage
                label="Upload Image"
                formats={["JPG"]} // "PNG"
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
          <Col xl={12} md={24}>
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
                    label="Blockchain"
                    list={blockchainList}
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
        open={loading}
        title="Follow steps"
        closable={false}
        width={550}
        centered={isTablet as boolean}
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
        open={isOpenSuccessModal}
        onClose={closeSuccessPopup}
        message="Congratulations! You’ve created new badge!"
        description="Once the transaction is confirmed your badge will appear in Badges section."
      />
    </div>
  );
};

export default CreateBadgeForm;
