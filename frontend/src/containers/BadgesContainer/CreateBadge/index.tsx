import { useContext, useEffect, useMemo, useState } from "react";
import { Col, Row } from "antd";

import { WalletContext } from "contexts/Wallet";
import BaseButton from "components/BaseButton";
import UploadImage from "components/UploadImage";
import FormInput from "components/FormInput";
import PageTitle from "components/PageTitle";
import { LeftArrowIcon } from "icons";
import { SuccessModalComponent } from "components/ModalComponent";
import SelectedBlockchain from "../SelectedBlockchain";

import { useAppSelector } from "hooks/reduxHooks";
import { useCreateBadgeMutation } from "store/services/BadgesService";
import { addNotification, isValidateFilledForm } from "utils";

import { initBadgeData } from "consts";
import { IBadge } from "appTypes";
import "./styles.sass";

const CreateBadgeForm = ({
  backBtn,
}: {
  backBtn: (updateList?: boolean) => () => void;
}) => {
  const { id, username } = useAppSelector(({ user }) => user);
  const walletConf = useContext(WalletContext);
  const [createBadge, { isLoading, isSuccess }] = useCreateBadgeMutation();

  const [isOpenSuccessModal, setIsOpenSuccessModal] = useState(false);

  const [formBadge, setFormBadge] = useState<IBadge>(initBadgeData);

  const { image, title, description } = formBadge;

  const closeSuccessPopup = () => {
    setIsOpenSuccessModal(false);
    setFormBadge({ ...initBadgeData });

    const backMethod = backBtn(true);
    backMethod();
  };

  const createHandler = async () => {
    const { image, title, description, blockchain } = formBadge;
    const isValidate = isValidateFilledForm(
      Object.values({
        image: image.file,
        title,
        description,
        blockchain,
      })
    );

    if (isValidate) {
      await createBadge({
        file: image.file,
        data: {
          title,
          description,
          blockchain,
          creator_id: id,
        },
        username,
      });
    } else {
      addNotification({
        type: "danger",
        title: "Not all fields are filled",
      });
    }
  };

  const selectedBlockchainIconInfo = useMemo(() => {
    const info = walletConf.main_contract.blockchains.find(
      (b) => b.name === "polygon"
    );
    return info;
  }, [walletConf]);

  useEffect(() => {
    if (isSuccess) setIsOpenSuccessModal(true);
  }, [isSuccess]);

  return (
    <div className="create_badges fadeIn">
      <div className="title badges-title">
        <div className="icon" onClick={backBtn()}>
          <LeftArrowIcon />
        </div>
        <PageTitle formatId="create_badge_form_button" notMarginBottom />
      </div>
      <Row gutter={[4, 16]} className="form" justify="space-between">
        <Col xl={10} md={12}>
          <div className="upload-block">
            <UploadImage
              label="Upload Image"
              formats={["PNG", "JPG", "JPEG", "GIF"]}
              maxFileSize={5}
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
        <Col xl={13} md={24}>
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
                <div className="selected-blockchain">
                  <p className="placeholder">Blockhain</p>
                  {selectedBlockchainIconInfo && (
                    <SelectedBlockchain
                      blockchainInfo={selectedBlockchainIconInfo}
                      modificator="form-blockchain"
                    />
                  )}
                </div>
              </div>
            </Col>
            <Col span={24}>
              <div className="btn-bottom">
                <BaseButton
                  title="Cancel"
                  padding="6px 35px"
                  onClick={backBtn()}
                  fontSize="18px"
                  disabled={isLoading}
                  isBlack
                />
                <BaseButton
                  formatId="create_badge_form_button"
                  padding="6px 25px"
                  onClick={createHandler}
                  fontSize="18px"
                  modificator="create-btn"
                  disabled={isLoading}
                  isMain
                />
              </div>
            </Col>
          </Row>
        </Col>
      </Row>
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
