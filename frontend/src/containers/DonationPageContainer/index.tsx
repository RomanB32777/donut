import { Col, Row, QRCode } from "antd";
import { useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import clsx from "clsx";
import { defaultAssetsFolders } from "types";

import { useAppSelector } from "hooks/reduxHooks";
import useWindowDimensions from "hooks/useWindowDimensions";
import axiosClient, { baseURL } from "modules/axiosClient";
import BaseButton from "components/BaseButton";
import PageTitle from "components/PageTitle";
import ColorPicker from "components/ColorPicker";
import LinkCopy from "components/LinkCopy";
import UploadImage, { UploadAfterEl } from "components/UploadImage";
import FormInput from "components/FormInput";
import ModalComponent from "components/ModalComponent";
import { SmallToggleListArrowIcon } from "icons";
import { IFileInfo, IDefaultImagesModal } from "appTypes";
import { tryToGetUser } from "store/types/User";
import {
  addNotification,
  addSuccessNotification,
  getDefaultImages,
  sendFile,
} from "utils";
import "./styles.sass";

type donationImageTypes = "header" | "banner";

interface IDonationInfoData {
  header: IFileInfo;
  banner: IFileInfo;
  welcome_text: string;
  btn_text: string;
  main_color: string;
  background_color: string;
}

interface IBannerModalInfo extends IDefaultImagesModal {
  folder: defaultAssetsFolders;
}

const DonationPageContainer = () => {
  const dispatch = useDispatch();
  const { id, wallet_address, username, donat_page } = useAppSelector(
    ({ user }) => user
  );
  const [donationInfoData, setDonationInfoData] = useState<IDonationInfoData>({
    banner: {
      preview: "",
      file: null,
    },
    header: {
      preview: "",
      file: null,
    },
    welcome_text: "",
    btn_text: "",
    main_color: "#ffffff",
    background_color: "#ffffff",
  });

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

  const selectDefaultBanner = ({
    image,
    imageType,
  }: {
    image: string;
    imageType: donationImageTypes;
  }) => {
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

  const sendData = async () => {
    try {
      setLoading(true);
      const {
        header,
        banner,
        welcome_text,
        btn_text,
        main_color,
        background_color,
      } = donationInfoData;
      await axiosClient.put("/api/user/edit/", {
        welcome_text,
        btn_text,
        main_color,
        background_color,
        user_id: id,
      });

      let fileType: defaultAssetsFolders = "header";
      if (header.file || header.preview !== donat_page.header_banner) {
        await sendFile({
          file: header.file,
          filelink: header.preview,
          username,
          userId: id,
          url: `/api/user/edit-creator-image/${fileType}`,
        });
      }
      if (banner.file || banner.preview !== donat_page.background_banner) {
        fileType = "background";
        await sendFile({
          file: banner.file,
          filelink: banner.preview,
          username,
          userId: id,
          url: `/api/user/edit-creator-image/${fileType}`,
        });
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

  useEffect(() => {
    if (id)
      setDonationInfoData((prevInfo) => ({
        ...prevInfo,
        header: {
          preview: donat_page.header_banner || "",
          file: prevInfo.header.file,
        },
        banner: {
          preview: donat_page.background_banner || "",
          file: prevInfo.banner.file,
        },
        welcome_text: donat_page.welcome_text,
        btn_text: donat_page.btn_text,
        main_color: donat_page.main_color,
        background_color: donat_page.background_color,
      }));
  }, [id]);

  useEffect(() => {
    console.log(bannerModalInfo);
  }, [bannerModalInfo]);

  const linkForSupport = useMemo(
    () => baseURL + "/support/" + username, //+ "/" + user.security_string,
    [username]
  );

  const {
    header,
    banner,
    welcome_text,
    btn_text,
    main_color,
    background_color,
  } = donationInfoData;

  const { isOpen, folder, images } = bannerModalInfo;

  const isHeaderBanner = useMemo(() => folder === "header", [folder]);

  return (
    <div className="donationPage-container">
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
          <div className="qr-wrapper">
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
                filePreview={header.preview}
                setFile={({ preview, file }) =>
                  setDonationInfoData({
                    ...donationInfoData,
                    header: {
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
                filePreview={banner.preview}
                setFile={({ preview, file }) =>
                  setDonationInfoData({
                    ...donationInfoData,
                    banner: {
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
        <div className="saveBottom">
          <BaseButton
            formatId="profile_form_save_changes_button"
            padding="6px 35px"
            onClick={sendData}
            fontSize="18px"
            disabled={loading}
            isMain
          />
        </div>
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
                onClick={() =>
                  selectDefaultBanner({
                    image,
                    imageType: isHeaderBanner ? "header" : "banner",
                  })
                }
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
