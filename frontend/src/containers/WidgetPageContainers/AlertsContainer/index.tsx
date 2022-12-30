import React, { useEffect, useMemo, useState } from "react";
import { Col, Row } from "antd";
import styled from "styled-components";
import FontFaceObserver from "fontfaceobserver";
import { ISoundInfo } from "types";

import { useAppSelector } from "../../../hooks/reduxHooks";
import useWindowDimensions from "../../../hooks/useWindowDimensions";
import axiosClient, { baseURL } from "../../../axiosClient";
import PageTitle from "../../../components/PageTitle";
import ColorPicker from "../../../components/ColorPicker";
import UploadImage, { UploadAfterEl } from "../../../components/UploadImage";
import BaseButton from "../../../components/BaseButton";
import LinkCopy from "../../../components/LinkCopy";
import SelectComponent from "../../../components/SelectComponent";
import SelectInput, { ISelectItem } from "../../../components/SelectInput";
import SliderForm from "../../../components/SliderForm";
import SwitchForm from "../../../components/SwitchForm";
import { TabsComponent } from "../../../components/TabsComponent";
import WidgetMobileWrapper from "../../../components/WidgetMobileWrapper";
import ModalComponent from "../../../components/ModalComponent";
import {
  addNotification,
  addSuccessNotification,
  getDefaultImages,
  getFontsList,
  getSounds,
  sendFile,
} from "../../../utils";
import { IAlert, IDefaultImagesModal } from "../../../types";
import { initAlertData } from "../../../consts";
import donImg from "../../../assets/big_don.png";
// import { soundsList } from "../../../assets/sounds";
import "./styles.sass";

const alertSound = new Audio();

const StyledText = styled.span<{
  color?: string;
  font: string;
  fontLink: string;
}>`
  @font-face {
    font-family: "${({ font }) => font}";
    font-weight: 400;
    font-style: normal;
    src: url("${({ fontLink }) => fontLink}");
  }
  font-family: "${({ font }) => font}", sans-serif;
  color: ${({ color }) => color};
`;

const SelectDropdownOption = (item: ISelectItem) => (
  <StyledText font={item.value} fontLink={item.key}>
    {item.value}
  </StyledText>
);

const PreviewAlertsBlock = ({ formData }: { formData: IAlert }) => {
  const {
    banner,
    message_color,
    message_font,
    name_color,
    name_font,
    sum_color,
    sum_font,
  } = formData;

  return (
    <Col
      xl={10}
      md={24}
      style={{
        width: "100%",
      }}
    >
      <div className="preview-block">
        <div className="preview-block_img">
          <img src={banner.preview || donImg} alt="preview logo" />
        </div>

        <div className="preview-block_title">
          <p>
            <StyledText
              color={name_color}
              font={name_font.name}
              fontLink={name_font.link}
            >
              MrBeast
            </StyledText>
            &nbsp; -&nbsp;
            <StyledText
              color={sum_color}
              font={sum_font.name}
              fontLink={sum_font.link}
            >
              10 USD
            </StyledText>
          </p>
        </div>
        <p className="preview-block_message">
          <StyledText
            color={message_color}
            font={message_font.name}
            fontLink={message_font.link}
          >
            Thank you for your stream!
          </StyledText>
        </p>
      </div>
    </Col>
  );
};

const SettingsAlertsBlock = ({
  formData,
  fonts,
  setFormData,
}: {
  formData: IAlert;
  fonts: ISelectItem[];
  setFormData: (formData: IAlert) => void;
}) => {
  const {
    banner,
    message_color,
    message_font,
    name_color,
    name_font,
    sum_color,
    sum_font,
    duration,
    sound,
    voice,
    gender_voice,
  } = formData;

  const { id } = useAppSelector(({ user }) => user);

  // const [play] = useSound(soundsList[sound]);
  const [soundsList, setSoundsList] = useState<ISoundInfo[]>([]);
  const [modalInfo, setModalInfo] = useState<IDefaultImagesModal>({
    isOpen: false,
    images: [],
  });

  const { isOpen, images } = modalInfo;

  const openDefaultImages = async () => {
    const images = await getDefaultImages("alerts");
    images.length &&
      setModalInfo({
        isOpen: true,
        images,
      });
  };

  const closeModal = () => setModalInfo({ isOpen: false, images: [] });

  const selectDefaultBanner = (image: string) => {
    setFormData({
      ...formData,
      banner: {
        file: null,
        preview: image,
      },
    });
    closeModal();
  };

  useEffect(() => {
    const initSounds = async () => {
      const sounds = await getSounds(id);
      sounds.length && setSoundsList(sounds);
    };
    id && initSounds();
  }, [id]);

  useEffect(() => {
    if (sound) {
      const soundInfo = soundsList.find((s) => s.name === sound);
      if (alertSound && soundInfo) {
        alertSound.pause();
        alertSound.src = soundInfo.link;
        alertSound.play();
      }
    }
  }, [sound]);

  return (
    <Col xl={13} md={24}>
      <Row gutter={[0, 18]} className="form">
        <Col span={24}>
          <div className="form-element">
            <UploadImage
              label="Banner:"
              formats={["PNG", "JPG", "JPEG", "GIF"]}
              filePreview={banner.preview || donImg}
              setFile={({ preview, file }) =>
                setFormData({
                  ...formData,
                  banner: {
                    file,
                    preview,
                  },
                })
              }
              afterEl={
                <UploadAfterEl
                  size="1200*800"
                  openBanners={openDefaultImages}
                />
              }
              labelCol={8}
              inputCol={8}
            />
          </div>
        </Col>
        <Col span={24}>
          <div className="form-element">
            <ColorPicker
              setColor={(color) =>
                setFormData({ ...formData, message_color: color })
              }
              color={message_color}
              label="Message color:"
              labelCol={8}
              inputCol={14}
              gutter={[0, 18]}
            />
          </div>
        </Col>
        <Col span={24}>
          <div className="form-element">
            <ColorPicker
              setColor={(color) =>
                setFormData({ ...formData, name_color: color })
              }
              color={name_color}
              label="Donor name color:"
              labelCol={8}
              inputCol={14}
              gutter={[0, 18]}
            />
          </div>
        </Col>
        <Col span={24}>
          <div className="form-element">
            <ColorPicker
              setColor={(color) =>
                setFormData({ ...formData, sum_color: color })
              }
              color={sum_color}
              label="Donation sum color:"
              labelCol={8}
              inputCol={14}
              gutter={[0, 18]}
            />
          </div>
        </Col>
        <Col span={24}>
          <div className="form-element">
            <SelectInput
              label="Message font:"
              value={message_font.name}
              list={fonts}
              modificator="form-select"
              setValue={(selected, option) =>
                setFormData({
                  ...formData,
                  message_font: {
                    name: option?.title,
                    link: selected as string,
                  },
                })
              }
              renderOption={SelectDropdownOption}
              labelCol={8}
              selectCol={14}
              gutter={[0, 18]}
              showSearch
            />
          </div>
        </Col>
        <Col span={24}>
          <div className="form-element">
            <SelectInput
              label="Supporter font: "
              value={name_font.name}
              list={fonts}
              modificator="form-select"
              setValue={(selected, option) =>
                setFormData({
                  ...formData,
                  name_font: {
                    name: option?.title,
                    link: selected as string,
                  },
                })
              }
              renderOption={SelectDropdownOption}
              labelCol={8}
              selectCol={14}
              gutter={[0, 18]}
              showSearch
            />
          </div>
        </Col>
        <Col span={24}>
          <div className="form-element">
            <SelectInput
              label="Donation sum font:"
              value={sum_font.name}
              list={fonts}
              modificator="form-select"
              setValue={(selected, option) =>
                setFormData({
                  ...formData,
                  sum_font: {
                    name: option?.title,
                    link: selected as string,
                  },
                })
              }
              renderOption={SelectDropdownOption}
              labelCol={8}
              selectCol={14}
              gutter={[0, 18]}
              showSearch
            />
          </div>
        </Col>
        <Col span={24}>
          <div className="form-element">
            <SliderForm
              label="Alert duration:"
              step={1}
              max={25}
              min={15}
              setValue={(num) => setFormData({ ...formData, duration: num })}
              value={+duration}
              maxWidth={250}
              description={`${duration} sec`}
              labelCol={8}
              sliderCol={14}
              gutter={[0, 18]}
            />
          </div>
        </Col>
        <Col span={24}>
          <div className="form-element">
            <Row
              style={{
                width: "100%",
              }}
              gutter={[0, 18]}
              align="middle"
            >
              <Col sm={8} xs={12}>
                <span className="form-element__label">Alert sound:</span>
              </Col>
              <Col md={4}>
                <SelectComponent
                  title={sound}
                  list={soundsList.map((s) => s.name)}
                  selectItem={(selected) =>
                    setFormData({ ...formData, sound: selected })
                  }
                  // play();
                  modificator="select-sound"
                  listModificator="list-sound"
                  listItemModificator="listItem-sound"
                  headerList={
                    <div className="select-header">Donation sounds</div>
                  }
                  footerList={
                    <div className="select-footer">Upload custom sound +</div>
                  }
                />
              </Col>
            </Row>
          </div>
        </Col>
        <Col span={24}>
          <div className="form-element">
            <SwitchForm
              label="Voice alerts:"
              checked={voice}
              setValue={(flag) => setFormData({ ...formData, voice: flag })}
              maxWidth={250}
              labelCol={8}
              switchCol={14}
              gutter={[0, 18]}
              afterComponent={
                voice ? (
                  <TabsComponent
                    setTabContent={(gender_voice) =>
                      setFormData({ ...formData, gender_voice })
                    }
                    activeKey={gender_voice}
                    tabs={[
                      {
                        key: "MALE",
                        label: "Male",
                      },
                      {
                        key: "FEMALE",
                        label: "Female",
                      },
                    ]}
                  />
                ) : null
              }
              isVisibleStatus
            />
          </div>
        </Col>
        <ModalComponent
          open={isOpen}
          title="Default donation alert banners"
          width={900}
          onCancel={closeModal}
          className="alert-modal"
          topModal
        >
          <Row gutter={[16, 32]} justify="space-between">
            {images.map((image, key) => (
              <Col md={8} key={`banner-${image}-${key}`}>
                <div
                  className="default-banner"
                  onClick={() => selectDefaultBanner(image)}
                >
                  <img src={image} alt={`banner-${key}`} />
                </div>
              </Col>
            ))}
          </Row>
        </ModalComponent>
      </Row>
    </Col>
  );
};

const AlertsContainer = () => {
  const { id, username, donat_page } = useAppSelector(({ user }) => user);
  const { isLaptop } = useWindowDimensions();
  const [loading, setLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState<IAlert>({ ...initAlertData });
  const [fonts, setFonts] = useState<ISelectItem[]>([]);

  const getAlertsWidgetData = async () => {
    if (id && fonts) {
      const { data } = await axiosClient.get(
        "/api/widget/get-alerts-widget/" + id
      );

      const userData: IAlert = {
        ...data,
        name_font: {
          name: data.name_font,
          link: fonts.find(({ value }) => value === data.name_font)?.key,
        },
        message_font: {
          name: data.message_font,
          link: fonts.find(({ value }) => value === data.message_font)?.key,
        },
        sum_font: {
          name: data.sum_font,
          link: fonts.find(({ value }) => value === data.sum_font)?.key,
        },
        banner: {
          preview: data.banner_link || "",
          file: formData.banner.file,
        },
      };

      setFormData({
        ...formData,
        ...userData,
      });
    }
  };

  const sendData = async () => {
    try {
      setLoading(true);
      const {
        banner,
        message_color,
        message_font,
        name_color,
        name_font,
        sum_color,
        sum_font,
        duration,
        sound,
        voice,
        gender_voice,
      } = formData;

      (banner.file || banner.preview) &&
        (await sendFile({
          file: banner.file,
          filelink: banner.preview,
          username,
          userId: id,
          data: {
            key: "alertData",
            body: JSON.stringify({
              message_color,
              message_font: message_font.name,
              name_color,
              name_font: name_font.name,
              sum_color,
              sum_font: sum_font.name,
              duration,
              sound,
              voice,
              gender_voice,
            }),
          },
          url: "/api/widget/edit-alerts-widget/",
        }));

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
    id && fonts.length && getAlertsWidgetData();
  }, [id, fonts]);

  // useEffect(() => {
  //   console.log("loaded", fonts.length);
  //   if (fonts.length) {
  //     const fontObservers = fonts.map(
  //       (font) => new FontFaceObserver(font.value)
  //     );
  //     console.log(fontObservers);

  //     fontObservers[0].load().then(function () {
  //       console.log("Family A");
  //     });

  //     // fontA.load(), fontB.load()

  //     Promise.all(fontObservers.map((font) => font.load())).then(function () {
  //       console.log("Family A & B have loaded");
  //     });
  //   }
  // }, [fonts]);

  useEffect(() => {
    const initFonts = async () => {
      const fonts = await getFontsList();
      setFonts(fonts);
    };
    initFonts();
  }, []);

  const linkForStream = useMemo(
    () => `${baseURL}/donat-message/${username}/${donat_page.security_string}`,
    [username, donat_page]
  );

  // const testFonts =

  // console.log(testFonts);

  // const fontA = new FontFaceObserver(message_font.name);
  // var fontB = new FontFaceObserver("Family B");

  // fontA.load().then(function () {
  //   console.log("Family A is available");//   сщтыщдуюдщп(ЭАфьшдн Ф шы фмфшдфидуЭ)ж

  // });

  return (
    <div className="alerts-container">
      {/* {fonts.length &&
        fonts.map((font) => (
          <StyledText font={font.value} fontLink={font.key} />
        ))} */}
      <PageTitle formatId="page_title_alerts" />
      <div className="link-top">
        <p>
          Paste this link into broadcasting software you use and display your
          incoming donations
        </p>
        <LinkCopy link={linkForStream} isSimple={!isLaptop} />
      </div>
      <div className="alertsSettings">
        <PageTitle formatId="page_title_design" />
        <WidgetMobileWrapper
          previewBlock={
            <PreviewAlertsBlock key="preview" formData={formData} />
          }
          settingsBlock={
            <SettingsAlertsBlock
              key="settings"
              fonts={fonts}
              formData={formData}
              setFormData={setFormData}
            />
          }
        />
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
      {/* <ChromePicker color={color} onChangeComplete={handleChange} disableAlpha /> */}
    </div>
  );
};

export default AlertsContainer;
