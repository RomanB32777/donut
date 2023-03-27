import { Col, Row, QRCode } from "antd";
import { useCallback, useEffect, useMemo, useState } from "react";
import clsx from "clsx";
import { FormattedMessage } from "react-intl";
import { BannerTypes, bannerTypes, donatAssetTypes } from "types";

import BaseButton from "components/BaseButton";
import PageTitle from "components/PageTitle";
import ColorPicker from "components/ColorPicker";
import LinkCopy from "components/LinkCopy";
import UploadImage, { UploadAfterEl } from "components/UploadImage";
import FormInput from "components/FormInput";
import ModalComponent from "components/ModalComponent";
import FormBtnsBlock from "components/FormBtnsBlock";
import { SmallToggleListArrowIcon } from "icons";

import { useAppSelector } from "hooks/reduxHooks";
import useWindowDimensions from "hooks/useWindowDimensions";
import { useEditCreatorMutation } from "store/services/UserService";
import { useLazyGetDefaultImagesQuery } from "store/services/FilesService";
import { RoutePaths, initDonatPage, baseURL } from "consts";
import { IDonatPageWithFiles, DonatPageFiellds } from "appTypes";
import { IBannerModalInfo } from "./types";
import "./styles.sass";

const DonationPageContainer = () => {
  const [editCreator, { isLoading: isEditCreatorLoading }] =
    useEditCreatorMutation();
  const [getDefaultImages] = useLazyGetDefaultImagesQuery();
  const user = useAppSelector(({ user }) => user);

  const [donationInfoData, setDonationInfoData] =
    useState<IDonatPageWithFiles>(initDonatPage);
  const [isOpenQR, setIsOpenQR] = useState<boolean>(false);
  const [bannerModalInfo, setBannerModalInfo] = useState<IBannerModalInfo>({
    images: [],
    folder: "background",
    isOpen: false,
  });
  const { isMobile } = useWindowDimensions();

  const { id, username, creator } = user;

  const formElementsHandler = useCallback(
    <T,>(field: DonatPageFiellds) =>
      (value: T) =>
        setDonationInfoData((form) => ({ ...form, [field]: value })),
    []
  );

  const openBannersPopup = async (folder: donatAssetTypes) => {
    const { data: images } = await getDefaultImages(folder);
    images &&
      setBannerModalInfo({
        images,
        folder,
        isOpen: true,
      });
  };

  const closeBannersPopup = () =>
    setBannerModalInfo((prev) => ({ ...prev, isOpen: false }));

  const selectDefaultBanner =
    ({ image, imageType }: { image: string; imageType: bannerTypes }) =>
    () => {
      setDonationInfoData({
        ...donationInfoData,
        [imageType]: {
          file: null,
          preview: image,
        },
      });
      closeBannersPopup();
    };

  const onImageDownload = () => {
    const canvas = document
      .querySelector(".QRCode")
      ?.querySelector<HTMLCanvasElement>("canvas");
    if (canvas) {
      const url = canvas.toDataURL();
      const a = document.createElement("a");
      a.download = "QRCode.png";
      a.href = url;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  const sendData = (isReset?: boolean) => async () => {
    if (creator) {
      if (isReset) {
        await editCreator({ isReset });
      } else {
        const changedField = Object.keys(donationInfoData).filter((field) => {
          const key = field as DonatPageFiellds;
          return donationInfoData[key] !== creator[key];
        });

        if (changedField.length) {
          const changedCreatorInfo = changedField.reduce(
            (obj, field) => ({
              ...obj,
              [field]: donationInfoData[field as DonatPageFiellds],
            }),
            {} as Partial<IDonatPageWithFiles>
          );

          const { headerBanner, backgroundBanner, ...donatPageInfo } =
            changedCreatorInfo;

          const [editArgs]: Parameters<typeof editCreator> = [donatPageInfo];

          // TODO
          if (headerBanner) {
            const { file, preview } = headerBanner;
            if (file) editArgs.header = file;
            else editArgs.headerBanner = preview;
          }

          // TODO
          if (backgroundBanner) {
            const { file, preview } = backgroundBanner;
            if (file) editArgs.background = file;
            else editArgs.backgroundBanner = preview;
          }
          await editCreator(editArgs);
        }
      }
    }
  };

  const resetData = sendData(true);

  useEffect(() => {
    if (id && creator) {
      const {
        headerBanner,
        backgroundBanner,
        welcomeText,
        btnText,
        mainColor,
        backgroundColor,
      } = creator;

      setDonationInfoData((prevInfo) => ({
        ...prevInfo,
        headerBanner: {
          preview: headerBanner || "",
          file: prevInfo.headerBanner.file,
        },
        backgroundBanner: {
          preview: backgroundBanner || "",
          file: prevInfo.backgroundBanner.file,
        },
        welcomeText,
        btnText,
        mainColor,
        backgroundColor,
      }));
    }
  }, [id, creator]);

  const linkForSupport = useMemo(
    () => `${baseURL}/${RoutePaths.support}/${username}`,
    [username]
  );

  const {
    headerBanner,
    backgroundBanner,
    welcomeText,
    btnText,
    mainColor,
    backgroundColor,
  } = donationInfoData;

  const { isOpen, folder, images } = bannerModalInfo;

  const isHeaderBanner = useMemo(() => folder === "header", [folder]);

  return (
    <div className="donationPage-container fadeIn">
      <PageTitle formatId="page_title_donation_page" />
      <div className="link-top">
        <p>
          <FormattedMessage id="donation_subtitle" />
        </p>
        <LinkCopy link={linkForSupport} isSimple={!isMobile} />
      </div>
      <div className="qr">
        <div
          className="qr-title"
          onClick={() => {
            setIsOpenQR(!isOpenQR);
          }}
        >
          <span>
            <FormattedMessage id="donation_generate_button" />
          </span>
          <div
            className={clsx("icon", {
              rotated: isOpenQR,
            })}
          >
            <SmallToggleListArrowIcon />
          </div>
        </div>
        {isOpenQR && (
          <div className="qr-wrapper fadeIn">
            <div className="qr-block">
              <QRCode
                errorLevel="H"
                className="QRCode"
                value={linkForSupport}
                bordered={false}
                // icon={avatar}
              />
            </div>
            <BaseButton
              formatId="donation_download_button"
              padding="6px 26px"
              onClick={onImageDownload}
              fontSize="18px"
              isMain
            />
          </div>
        )}
      </div>
      <div className="designSettings">
        <PageTitle formatId="page_title_design" />
        <Row gutter={[0, 18]} className="form">
          <Col span={24}>
            <div className="form-element">
              <UploadImage
                label={<FormattedMessage id="donation_header_banner" />}
                formats={["PNG", "JPG", "JPEG"]}
                filePreview={headerBanner.preview}
                setFile={formElementsHandler(BannerTypes.headerBanner)}
                afterEl={
                  <UploadAfterEl
                    size="1200*800"
                    mdCol={6}
                    alsoText={<FormattedMessage id="upload_choose_banners" />}
                    openBanners={() => openBannersPopup("header")}
                  />
                }
                labelCol={6}
                inputCol={10}
                isBanner
                isWithClearIcon
              />
            </div>
          </Col>

          <Col span={24}>
            <div className="form-element">
              <UploadImage
                label={<FormattedMessage id="donation_background_banner" />}
                formats={["PNG", "JPG", "JPEG"]}
                filePreview={backgroundBanner.preview}
                setFile={formElementsHandler(BannerTypes.backgroundBanner)}
                afterEl={
                  <UploadAfterEl
                    size="1200*800"
                    mdCol={6}
                    alsoText={<FormattedMessage id="upload_choose_banners" />}
                    openBanners={() => openBannersPopup("background")}
                  />
                }
                labelCol={6}
                inputCol={10}
                isBanner
                isWithClearIcon
              />
            </div>
          </Col>
          <Col span={24}>
            <div className="form-element">
              <FormInput
                label={<FormattedMessage id="donation_welcome_text" />}
                name="welcomeText"
                value={welcomeText}
                setValue={formElementsHandler("welcomeText")}
                labelCol={7}
                inputCol={10}
                gutter={[0, 16]}
                isTextarea
              />
            </div>
          </Col>
          <Col span={24}>
            <div className="form-element">
              <FormInput
                label={<FormattedMessage id="donation_button_text" />}
                name="buttonText"
                value={btnText}
                setValue={formElementsHandler("btnText")}
                labelCol={7}
                inputCol={10}
                gutter={[0, 16]}
              />
            </div>
          </Col>
          <Col span={24}>
            <div className="form-element">
              <ColorPicker
                name="donation_main_color"
                color={mainColor}
                label={<FormattedMessage id="donation_main_color" />}
                setColor={formElementsHandler("mainColor")}
                labelCol={7}
                gutter={[0, 16]}
              />
            </div>
          </Col>
          <Col span={24}>
            <div className="form-element">
              <ColorPicker
                name="donation_background_color"
                color={backgroundColor}
                label={<FormattedMessage id="donation_background_color" />}
                setColor={formElementsHandler("backgroundColor")}
                labelCol={7}
                gutter={[0, 16]}
              />
            </div>
          </Col>
        </Row>
        <FormBtnsBlock
          saveMethod={sendData()}
          resetMethod={resetData}
          disabled={isEditCreatorLoading}
        />
      </div>
      <ModalComponent
        open={isOpen}
        title={`Default ${isHeaderBanner ? "header" : "background"} banners`}
        width={900}
        onCancel={closeBannersPopup}
        className="donat-modal"
        topModal
      >
        <Row gutter={[16, 32]} justify="space-between">
          {images.map(({ name, path }, key) => (
            <Col md={isHeaderBanner ? 24 : 8} key={`banner-${name}-${key}`}>
              <div
                className={clsx("default-banner", {
                  long: isHeaderBanner,
                })}
                onClick={selectDefaultBanner({
                  image: path,
                  imageType: isHeaderBanner
                    ? "headerBanner"
                    : "backgroundBanner",
                })}
              >
                <img src={path} alt={`banner-${key}`} />
              </div>
            </Col>
          ))}
        </Row>
      </ModalComponent>
    </div>
  );
};

export default DonationPageContainer;
