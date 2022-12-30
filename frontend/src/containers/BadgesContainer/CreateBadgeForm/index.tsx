import { useContext, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { Col, Row, StepProps, Steps, StepsProps } from "antd";
import { CheckOutlined, LoadingOutlined } from "@ant-design/icons";
import { IBadgeInfo } from "types";

import { WalletContext } from "../../../contexts/Wallet";
import { WebSocketContext } from "../../../components/Websocket";
import BaseButton from "../../../components/BaseButton";
import UploadImage from "../../../components/UploadImage";
import FormInput from "../../../components/FormInput";
import PageTitle from "../../../components/PageTitle";
import { LeftArrowIcon } from "../../../icons";
import SelectInput from "../../../components/SelectInput";
import ModalComponent, {
  SuccessModalComponent,
} from "../../../components/ModalComponent";
import axiosClient from "../../../axiosClient";
import useWindowDimensions from "../../../hooks/useWindowDimensions";
import { makeStorageClient } from "../utils";
import { addNotification } from "../../../utils";
import { IBadge } from "../../../types";
import { initBadgeData, ipfsFileformat, ipfsFilename } from "../../../consts";

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
    title: "Creating TRC 1155 collection",
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
  setActiveBadge?: (activeBadge: IBadge) => void;
  openBadgePage?: () => void;
}) => {
  const user = useSelector((state: any) => state.user);

  const { walletConf } = useContext(WalletContext);
  const socket = useContext(WebSocketContext);

  const { isTablet } = useWindowDimensions();
  const [loading, setLoading] = useState<boolean>(false);
  const [isOpenSuccessModal, setIsOpenSuccessModal] = useState<boolean>(false);
  const [loadingSteps, setLoadingSteps] = useState<StepProps[]>([
    ...initLoadingSteps,
  ]);

  const [formBadge, setFormBadge] = useState<IBadge>({
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
          title: "Creating TRC 1155 collection",
        },
        ...prev.slice(2, 3),
      ]);
    } else if (finishedStep === 1 && loadingStep === 2) {
      setLoadingSteps((prev) => [
        ...prev.slice(0, 1),
        {
          status: "finish",
          title: "Creating TRC 1155 collection",
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

        const _uri = await uploadToIpfs();

        setLoadingCurrStep({ finishedStep: 0, loadingStep: 1 });

        if (_uri) {
          const badgeContract = await walletConf.createContract({
            _uri,
            abi: walletConf.abi,
            bytecode: walletConf.bytecode,
            setLoadingStep: setLoadingCurrStep,
          });

          if (badgeContract && badgeContract?.contract_address) {
            const transactionResult = badgeContract?.result;

            console.log(transactionResult);

            if (transactionResult && transactionResult !== "SUCCESS")
              throw new Error(transactionResult);

            const badgeData: IBadgeInfo = {
              creator_id: user.id,
              contract_address: badgeContract.contract_address,
              blockchain,
              transaction_hash: badgeContract?.transaction_hash || "",
              result: transactionResult ? "success" : null, // success status here or null (if transactionResult = undefined)
            };

            const newBadge = await axiosClient.post("/api/badge/", badgeData);

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
                inputCol={24}
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
                    inputCol={24}
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
                    inputCol={24}
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
                    list={walletConf.blockchains.map(
                      ({ nativeCurrency, badgeName }) => ({
                        key: nativeCurrency.symbol,
                        value: badgeName,
                      })
                    )}
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
                    title="Deploy contract"
                    padding="6px 35px"
                    onClick={createContract}
                    fontSize="18px"
                    disabled={loading}
                    isMain
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
