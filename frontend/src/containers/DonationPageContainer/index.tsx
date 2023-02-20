import { Col, Row, QRCode } from "antd";
import { useEffect, useMemo, useState } from "react";
import clsx from "clsx";
import { bannerTypes, donatAssetTypes, IDonatPage, IEditUserInfo } from "types";

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
import {
  useEditCreatorImageMutation,
  useEditUserMutation,
} from "store/services/UserService";
import { useLazyGetDefaultImagesQuery } from "store/services/FilesService";
import { RoutePaths } from "routes";
import { initDonatPage, baseURL } from "consts";
import { IDonatPageWithFiles } from "appTypes";
import { IBannerModalInfo } from "./types";
import "./styles.sass";

const excludedСhangesFields: bannerTypes[] = [
  "background_banner",
  "header_banner",
];

const DonationPageContainer = () => {
  const [editUser, { isLoading: isEditUserLoading }] = useEditUserMutation();
  const [editCretorImage, { isLoading: isUserImageLoading }] =
    useEditCreatorImageMutation();
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

  const { id, username, donat_page } = user;

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

  const uploadImage = async (fileType: donatAssetTypes) => {
    const { file, preview } = donationInfoData[`${fileType}_banner`];
    if (file || preview !== donat_page[`${fileType}_banner`]) {
      await editCretorImage({
        file,
        filelink: preview,
        username,
        userID: id,
        fileType,
      });
    }
  };

  const sendData = (isReset?: boolean) => async () => {
    try {
      const changedField = Object.keys(donationInfoData).filter((field) => {
        const key = field as keyof IDonatPageWithFiles;
        return (
          !excludedСhangesFields.includes(key as any) &&
          donationInfoData[key] !== donat_page[key]
        );
      });

      if (!isReset) {
        await uploadImage("header");
        await uploadImage("background");
      }

      if (changedField.length || isReset) {
        const changedUserInfo: IEditUserInfo = {
          ...user,
          donat_page: changedField.reduce(
            (obj, field) => ({
              ...obj,
              [field]: donationInfoData[field as keyof IDonatPage],
            }),
            {} as IDonatPage
          ),
          isReset,
        };

        await editUser(changedUserInfo);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const resetData = sendData(true);

  useEffect(() => {
    if (id) {
      const {
        header_banner,
        background_banner,
        welcome_text,
        btn_text,
        main_color,
        background_color,
      } = donat_page;

      setDonationInfoData((prevInfo) => ({
        ...prevInfo,
        header_banner: {
          preview: header_banner || "",
          file: prevInfo.header_banner.file,
        },
        background_banner: {
          preview: background_banner || "",
          file: prevInfo.background_banner.file,
        },
        welcome_text,
        btn_text,
        main_color,
        background_color,
      }));
    }
  }, [id, donat_page]);

  const linkForSupport = useMemo(
    () => `${baseURL}/${RoutePaths.support}/${username}`,
    [username]
  );

  const {
    header_banner,
    background_banner,
    welcome_text,
    btn_text,
    main_color,
    background_color,
  } = donationInfoData;

  const { isOpen, folder, images } = bannerModalInfo;

  const isHeaderBanner = useMemo(() => folder === "header", [folder]);

  return (
    <div className="donationPage-container fadeIn">
      <PageTitle formatId="page_title_donation_page" />
      <div className="link-top">
        <p>Via the link below your supporters can send you donations</p>
        <LinkCopy link={linkForSupport} isSimple={!isMobile} />
      </div>
      <div className="qr">
        <div
          className="qr-title"
          onClick={() => {
            setIsOpenQR(!isOpenQR);
          }}
        >
          <span>Generate QR code</span>
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
              formatId="profile_form_download_png_button"
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
                label="Header banner:"
                formats={["PNG", "JPG", "JPEG"]}
                filePreview={header_banner.preview}
                setFile={({ preview, file }) =>
                  setDonationInfoData({
                    ...donationInfoData,
                    header_banner: {
                      file,
                      preview,
                    },
                  })
                }
                afterEl={
                  <UploadAfterEl
                    size="1200*800"
                    mdCol={6}
                    alsoText="You can also choose"
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
                label="Background banner:"
                formats={["PNG", "JPG", "JPEG"]}
                filePreview={background_banner.preview}
                setFile={({ preview, file }) =>
                  setDonationInfoData({
                    ...donationInfoData,
                    background_banner: {
                      file,
                      preview,
                    },
                  })
                }
                afterEl={
                  <UploadAfterEl
                    size="1200*800"
                    mdCol={6}
                    alsoText="You can also choose"
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
                label="Welcome text:"
                name="welcomeText"
                value={welcome_text}
                setValue={(value) =>
                  setDonationInfoData({
                    ...donationInfoData,
                    welcome_text: value,
                  })
                }
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
                label="Button text:"
                name="buttonText"
                value={btn_text}
                setValue={(value) =>
                  setDonationInfoData({
                    ...donationInfoData,
                    btn_text: value,
                  })
                }
                labelCol={7}
                inputCol={10}
                gutter={[0, 16]}
              />
            </div>
          </Col>
          <Col span={24}>
            <div className="form-element">
              <ColorPicker
                color={main_color}
                label="Main color:"
                setColor={(value) =>
                  setDonationInfoData({
                    ...donationInfoData,
                    main_color: value,
                  })
                }
                labelCol={7}
                gutter={[0, 16]}
              />
            </div>
          </Col>
          <Col span={24}>
            <div className="form-element">
              <ColorPicker
                color={background_color}
                label="Background color:"
                setColor={(value) =>
                  setDonationInfoData({
                    ...donationInfoData,
                    background_color: value,
                  })
                }
                labelCol={7}
                gutter={[0, 16]}
              />
            </div>
          </Col>
        </Row>
        <FormBtnsBlock
          saveMethod={sendData()}
          resetMethod={resetData}
          disabled={isEditUserLoading || isUserImageLoading}
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
          {images.map((image, key) => (
            <Col md={isHeaderBanner ? 24 : 8} key={`banner-${image}-${key}`}>
              <div
                className={clsx("default-banner", {
                  long: isHeaderBanner,
                })}
                onClick={selectDefaultBanner({
                  image,
                  imageType: isHeaderBanner
                    ? "header_banner"
                    : "background_banner",
                })}
              >
                <img src={image} alt={`banner-${key}`} />
              </div>
            </Col>
          ))}
        </Row>
      </ModalComponent>
    </div>
  );
};

export default DonationPageContainer;
