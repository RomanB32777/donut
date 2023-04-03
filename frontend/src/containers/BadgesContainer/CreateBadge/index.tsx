import { useEffect, useState } from "react";
import { FormattedMessage } from "react-intl";
import { Col, Row } from "antd";

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
import { fullChainsInfo } from "utils/wallets/wagmi";

import { initBadgeData } from "consts";
import { IBadge } from "appTypes";
import "./styles.sass";

const CreateBadgeForm = ({
  backBtn,
}: {
  backBtn: (updateList?: boolean) => () => void;
}) => {
  const { id } = useAppSelector(({ user }) => user);
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
    const blockchainName =
      fullChainsInfo["matic"] ?? fullChainsInfo["maticmum"];

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
        badges: image.file,
        title,
        description,
        blockchain: blockchainName.name,
        creator: id,
      });
    } else {
      addNotification({
        type: "danger",
        title: <FormattedMessage id="notification_not_filled" />,
      });
    }
  };

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
              label={<FormattedMessage id="upload_label_image" />}
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
              <p className="title">
                <FormattedMessage id="badges_create_information_title" />
              </p>
              <p className="description">
                <FormattedMessage id="badges_create_information_description" />
              </p>
            </Col>
            <Col span={24}>
              <div className="form-element">
                <FormInput
                  value={title}
                  setValue={(value) =>
                    setFormBadge({ ...formBadge, title: value })
                  }
                  placeholder="badges_create_information_input_name"
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
                  placeholder="badges_create_information_input_description"
                  modificator="description-area"
                  isTextarea
                />
              </div>
            </Col>
            <Col span={24}>
              <div className="form-element">
                <div className="selected-blockchain">
                  <p className="placeholder">
                    <FormattedMessage id="badges_create_information_blockhain" />
                  </p>
                  {/* process.env.NODE_ENV === "production" */}
                  <SelectedBlockchain
                    blockchainInfo={
                      fullChainsInfo["matic"] ?? fullChainsInfo["maticmum"]
                    }
                    modificator="form-blockchain"
                  />
                </div>
              </div>
            </Col>
            <Col span={24}>
              <div className="btn-bottom">
                <BaseButton
                  formatId="form_cancel_button"
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
        message={<FormattedMessage id="badges_success_modal_title" />}
        description={<FormattedMessage id="badges_success_modal_description" />}
      />
    </div>
  );
};

export default CreateBadgeForm;
