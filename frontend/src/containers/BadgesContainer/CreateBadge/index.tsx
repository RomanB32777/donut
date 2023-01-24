import { useContext, useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { Col, Row, StepProps, Steps, StepsProps } from "antd";
import { CheckOutlined, LoadingOutlined } from "@ant-design/icons";
import { blockchainsType, IBadgeInfo } from "types";

import { WalletContext } from "contexts/Wallet";
import BaseButton from "components/BaseButton";
import UploadImage from "components/UploadImage";
import FormInput from "components/FormInput";
import PageTitle from "components/PageTitle";
import { LeftArrowIcon } from "icons";
import SelectInput from "components/SelectInput";
import ModalComponent, {
  SuccessModalComponent,
} from "components/ModalComponent";
import { BlockchainOption } from "components/SelectInput/options/BlockchainOption";
import SelectedBlockchain from "../SelectedBlockchain";

import { useAppSelector } from "hooks/reduxHooks";
import useWindowDimensions from "hooks/useWindowDimensions";
import { setSelectedBlockchain } from "store/types/Wallet";
import { addNotification, delay, isValidateFilledForm, sendFile } from "utils";

import { initBadgeData } from "consts";
import { IBadge } from "appTypes";
import "./styles.sass";

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
          color: "#E94560",
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
    title: "Pay minting cost",
  },
  {
    status: "wait",
    title: "Wait for the badge to be minted",
  },
  {
    status: "wait",
    title: "Verification",
  },
];

const CreateBadgeForm = ({
  backBtn,
}: {
  backBtn: (updateList?: boolean) => () => void;
}) => {
  const dispatch = useDispatch();
  const { user, blockchain } = useAppSelector((state) => state);

  const walletConf = useContext(WalletContext);

  const { isTablet } = useWindowDimensions();
  const [loading, setLoading] = useState(false);
  const [isOpenSuccessModal, setIsOpenSuccessModal] = useState(false);
  const [loadingSteps, setLoadingSteps] = useState<StepProps[]>([
    ...initLoadingSteps,
  ]);

  const [formBadge, setFormBadge] = useState<IBadge>({
    ...initBadgeData,
  });

  const { id, username } = user;
  const { image, title, description, quantity } = formBadge;

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
          title: "Pay minting cost",
        },
        ...loadingSteps.slice(1, 3),
      ]);
    } else if (finishedStep === 0 && loadingStep === 1) {
      setLoadingSteps((prev) => [
        {
          status: "finish",
          title: "Pay minting cost",
        },
        {
          status: "process",
          title: "Wait for the badge to be minted",
        },
        ...prev.slice(2, 3),
      ]);
    } else if (finishedStep === 1 && loadingStep === 2) {
      setLoadingSteps((prev) => [
        ...prev.slice(0, 1),
        {
          status: "finish",
          title: "Wait for the badge to be minted",
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
    const backMethod = backBtn(true);
    backMethod();
  };

  const createBadge = async () => {
    const { image, title, description, quantity, blockchain } = formBadge;
    const isValidate = isValidateFilledForm(
      Object.values({
        image: image.file,
        title,
        description,
        quantity,
        blockchain,
      })
    );

    if (isValidate) {
      try {
        setLoading(true);
        setLoadingCurrStep({ loadingStep: 0 });
        await delay({
          ms: 2000,
          cb: () => setLoadingCurrStep({ finishedStep: 0, loadingStep: 1 }),
        });

        const sendingData = JSON.stringify({
          title,
          description,
          quantity,
          blockchain,
          creator_id: id,
        } as IBadgeInfo);

        if (image.file) {
          const newBadge = await sendFile({
            file: image.file,
            username,
            data: {
              key: "badgeData",
              body: sendingData,
            },
            url: "/api/badge/",
            isEdit: false,
          });
          if (newBadge) {
            setLoadingCurrStep({ finishedStep: 1, loadingStep: 2 });
            await delay({
              ms: 2500,
              cb: () => setLoadingCurrStep({ finishedStep: 2 }),
            });
            setIsOpenSuccessModal(true);
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

  const setBlockchain = async (selected: blockchainsType) => {
    const newBlockchaind = await walletConf.changeBlockchain(selected);
    if (newBlockchaind) {
      dispatch(setSelectedBlockchain(selected));
      setFormBadge({
        ...formBadge,
        blockchain: selected,
      });
    }
  };

  const selectedBlockchainIconInfo = useMemo(() => {
    const info = walletConf.main_contract.blockchains.find(
      (b) => b.name === blockchain
    );
    return info;
  }, [walletConf, blockchain]);

  useEffect(() => {
    blockchain && setFormBadge((form) => ({ ...form, blockchain: blockchain }));
  }, [blockchain]);

  return (
    <div className="create_badges fadeIn">
      <div className="title badges-title">
        <div className="icon" onClick={backBtn()}>
          <LeftArrowIcon />
        </div>
        <PageTitle formatId="create_badge_form_button" notMarginBottom />
      </div>
      <Row gutter={[4, 4]} className="form" justify="space-between">
        <Col xl={10} md={12}>
          <div className="upload-block">
            <UploadImage
              label="Upload Image"
              formats={["PNG", "JPG", "JPEG", "GIF"]}
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
              <p className="title">Badge information</p>
              <p className="description">
                Please fill in the required information
              </p>
            </Col>
            <Col span={24}>
              <div className="form-element">
                <FormInput
                  value={title}
                  setValue={(value) =>
                    setFormBadge({ ...formBadge, title: value })
                  }
                  placeholder="Badge name"
                />
              </div>
            </Col>
            <Col span={24}>
              <div className="form-element">
                <FormInput
                  value={description}
                  setValue={(value) =>
                    setFormBadge({ ...formBadge, description: value })
                  }
                  placeholder="Badge description"
                  modificator="description-area"
                  isTextarea
                />
              </div>
            </Col>
            <Col span={24}>
              <div className="form-element">
                <FormInput
                  typeInput="number"
                  value={quantity ? String(quantity) : ""}
                  setValue={(value) =>
                    setFormBadge({ ...formBadge, quantity: +value })
                  }
                  placeholder="Number of badges to create"
                />
              </div>
            </Col>
            <Col span={24}>
              <div className="form-element">
                <SelectInput
                  value={{
                    value: blockchain,
                    label: (
                      <div className="selected-blockchain">
                        <p className="placeholder">Blockhain</p>
                        {selectedBlockchainIconInfo && (
                          <SelectedBlockchain
                            blockchainInfo={selectedBlockchainIconInfo}
                          />
                        )}
                      </div>
                    ),
                  }}
                  list={walletConf.main_contract.blockchains.map(
                    ({ name, badgeName }) => ({
                      key: name,
                      value: badgeName,
                    })
                  )}
                  renderOption={BlockchainOption}
                  placeholder="Choose blockchain"
                  onChange={({ value }) => setBlockchain(value)}
                  gutter={[0, 18]}
                  labelInValue
                />
              </div>
            </Col>
            <Col span={24}>
              <div className="btn-bottom">
                <BaseButton
                  title="Cancel"
                  padding="6px 35px"
                  onClick={backBtn()}
                  fontSize="18px"
                  disabled={loading}
                  isBlack
                />
                <BaseButton
                  formatId="create_badge_form_button"
                  padding="6px 25px"
                  onClick={createBadge}
                  fontSize="18px"
                  modificator="create-btn"
                  disabled={loading}
                  isMain
                />
              </div>
            </Col>
          </Row>
        </Col>
      </Row>
      <ModalComponent
        open={loading}
        title="Follow steps"
        closable={false}
        width={550}
        centered={Boolean(isTablet)}
      >
        <div className="goals-modal">
          <Row gutter={[0, 18]} className="goals-modal__form" justify="center">
            <Col span={24}>
              <Steps
                direction="vertical"
                progressDot={customDot}
                items={loadingSteps.map(({ title, status }) => ({
                  title,
                  status,
                }))}
              />
            </Col>
          </Row>
        </div>
      </ModalComponent>
      <SuccessModalComponent
        open={isOpenSuccessModal}
        onClose={closeSuccessPopup}
        message="Congratulations! You've created new badge!"
        description="Click on it and assign to your supporters"
      />
    </div>
  );
};

export default CreateBadgeForm;
