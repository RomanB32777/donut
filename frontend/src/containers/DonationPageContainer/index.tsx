import { Col, Row, QRCode } from "antd";
import { useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import clsx from "clsx";
import { bannerTypes, defaultAssetsFolders, IDonatPage } from "types";

import axiosClient from "modules/axiosClient";
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
import { tryToGetUser } from "store/types/User";
import {
  addNotification,
  addSuccessNotification,
  getDefaultImages,
  sendFile,
} from "utils";
import { initDonatPage, baseURL } from "consts";
import { IDonatPageWithFiles } from "appTypes";
import { IBannerModalInfo } from "./types";
import "./styles.sass";

const DonationPageContainer = () => {
  const dispatch = useDispatch();
  const { id, wallet_address, username, donat_page } = useAppSelector(
    ({ user }) => user
  );
  const [donationInfoData, setDonationInfoData] =
    useState<IDonatPageWithFiles>(initDonatPage);

  const [isOpenQR, setIsOpenQR] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [bannerModalInfo, setBannerModalInfo] = useState<IBannerModalInfo>({
    images: [],
    folder: "background",
    isOpen: false,
  });
  const { isMobile } = useWindowDimensions();

  const openBannersPopup = async (folder: defaultAssetsFolders) => {
    const images = await getDefaultImages(folder);
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
    try {
      setLoading(true);
      const { header_banner, background_banner } = donationInfoData;

      const excludedСhangesFields: bannerTypes[] = [
        "background_banner",
        "header_banner",
      ];

      await axiosClient.put("/api/user/edit/", {
        donat_page: Object.keys(donationInfoData)
          .filter(
            (field) => !excludedСhangesFields.includes(field as any) /// ???
          )
          .reduce(
            (obj, field) => ({
              ...obj,
              [field]: donationInfoData[field as keyof IDonatPage],
            }),
            {}
          ),
        id: id,
        isReset,
      });

      if (!isReset) {
        let fileType: defaultAssetsFolders = "header";
        if (
          header_banner.file ||
          header_banner.preview !== donat_page.header_banner
        ) {
          const { file, preview } = header_banner;
          await sendFile({
            file,
            filelink: preview,
            username,
            userId: id,
            url: `/api/user/edit-creator-image/${fileType}`,
          });
        }
        if (
          background_banner.file ||
          background_banner.preview !== donat_page.background_banner
        ) {
          const { file, preview } = background_banner;

          fileType = "background";
          await sendFile({
            file,
            filelink: preview,
            username,
            userId: id,
            url: `/api/user/edit-creator-image/${fileType}`,
          });
        }
      }

      dispatch(tryToGetUser(wallet_address));
      addSuccessNotification({ message: "Data saved successfully" });
    } catch (error) {
      addNotification({
        type: "danger",
        title: "Error",
        message:
          (error as any)?.response?.data?.message ||
          `An error occurred while saving data`,
      });
    } finally {
      setLoading(false);
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
        security_string,
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
        security_string,
      }));
    }
  }, [id, donat_page]);

  const linkForSupport = useMemo(
    () => baseURL + "/support/" + username, //+ "/" + user.security_string,
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
          disabled={loading}
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
