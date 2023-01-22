import { useState } from "react";
import { Col, Row } from "antd";
import { ISoundInfo } from "types";

import ModalComponent from "components/ModalComponent";
import ColorPicker from "components/ColorPicker";
import UploadImage, { UploadAfterEl } from "components/UploadImage";
import SelectInput, { ISelectItem } from "components/SelectInput";
import { TabsComponent } from "components/TabsComponent";
import SliderForm from "components/SliderForm";
import SwitchForm from "components/SwitchForm";
import SelectComponent from "components/SelectComponent";
import {
  FontStyleElement,
  FontSelectOption,
} from "components/SelectInput/options/FontSelectOption";
import UploadSound from "./UploadSound";

import { useAppSelector } from "hooks/reduxHooks";
import { getDefaultImages, sendFile } from "utils";
import { dummyImg, notVisibleFontsCount } from "consts";
import { IAlert, IDefaultImagesModal } from "appTypes";

const alertSound = new Audio();

const SettingsAlertsBlock = ({
  formData,
  fonts,
  soundsList,
  setSoundsList,
  setFormData,
}: {
  formData: IAlert;
  fonts: ISelectItem[];
  soundsList: ISoundInfo[];
  setSoundsList: (sounds: ISoundInfo[]) => void;
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

  const { id, username } = useAppSelector(({ user }) => user);

  const [modalInfo, setModalInfo] = useState<IDefaultImagesModal>({
    isOpen: false,
    images: [],
  });

  const [fontList, setFontList] = useState<ISelectItem[]>(
    fonts.slice(0, notVisibleFontsCount)
  );

  const { isOpen, images } = modalInfo;

  const openDefaultImages = async () => {
    const images = await getDefaultImages("alert");
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

  const onOpenFontSelect = (isOpen: boolean) =>
    isOpen
      ? setFontList(fonts)
      : setFontList(fonts.slice(0, notVisibleFontsCount));

  const playSound = (soundLink: string) => {
    if (alertSound) {
      alertSound.pause();
      alertSound.src = soundLink;
      alertSound.play();
    }
  };

  const uploadUserSound = async (file: File) => {
    const res = await sendFile({
      file,
      username,
      userId: id,
      url: "/api/widget/sound/",
      isEdit: false,
    });

    if (res) {
      const { data } = res;
      playSound(data.link);
      setSoundsList([data, ...soundsList]);
      setFormData({
        ...formData,
        sound: data.name,
      });
    }
  };

  const selectSound = (selected: string) => {
    const soundInfo = soundsList.find((s) => s.name === selected);
    soundInfo && playSound(soundInfo.link);

    setFormData({
      ...formData,
      sound: selected,
    });
  };

  return (
    <Col xl={13} md={24}>
      <Row gutter={[0, 18]} className="form">
        <Col span={24}>
          <div className="form-element">
            <UploadImage
              label="Banner:"
              formats={["PNG", "JPG", "JPEG", "GIF"]}
              filePreview={banner.preview || dummyImg}
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
                  mdCol={8}
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
              value={{
                value: message_font.name,
                label: <FontStyleElement fontName={message_font.name} />,
              }}
              list={fontList}
              modificator="form-select"
              onChange={({ value }, option) =>
                setFormData({
                  ...formData,
                  message_font: {
                    name: !Array.isArray(option) && option.title,
                    link: value,
                  },
                })
              }
              onDropdownVisibleChange={onOpenFontSelect}
              renderOption={FontSelectOption}
              labelCol={8}
              selectCol={14}
              gutter={[0, 18]}
              labelInValue
              showSearch
            />
          </div>
        </Col>
        <Col span={24}>
          <div className="form-element">
            <SelectInput
              label="Supporter font:"
              value={{
                value: name_font.name,
                label: <FontStyleElement fontName={name_font.name} />,
              }}
              list={fontList}
              modificator="form-select"
              onChange={({ value }, option) =>
                setFormData({
                  ...formData,
                  name_font: {
                    name: !Array.isArray(option) && option.title,
                    link: value,
                  },
                })
              }
              onDropdownVisibleChange={onOpenFontSelect}
              renderOption={FontSelectOption}
              labelCol={8}
              selectCol={14}
              gutter={[0, 18]}
              labelInValue
              showSearch
            />
          </div>
        </Col>
        <Col span={24}>
          <div className="form-element">
            <SelectInput
              label="Donation sum font:"
              value={{
                value: sum_font.name,
                label: <FontStyleElement fontName={sum_font.name} />,
              }}
              list={fontList}
              modificator="form-select"
              onChange={({ value }, option) =>
                setFormData({
                  ...formData,
                  sum_font: {
                    name: !Array.isArray(option) && option.title,
                    link: value,
                  },
                })
              }
              onDropdownVisibleChange={onOpenFontSelect}
              renderOption={FontSelectOption}
              labelCol={8}
              selectCol={14}
              gutter={[0, 18]}
              labelInValue
              showSearch
            />
          </div>
        </Col>
        <Col span={24}>
          <div className="form-element">
            <Row
              gutter={[0, 18]}
              align="middle"
            >
              <Col md={8} xs={24}>
                <span className="form-element__label">Alert sound:</span>
              </Col>
              <Col md={14} xs={24}>
                <SelectComponent
                  title={sound}
                  list={soundsList.map((s) => s.name)}
                  selectItem={(selected) => {
                    selectSound(selected);
                  }}
                  modificator="select-sound"
                  listModificator="list-sound"
                  listItemModificator="listItem-sound"
                  headerList={
                    <div className="select-header">Donation sounds</div>
                  }
                  footerList={
                    <div className="select-footer">
                      <UploadSound sendFile={uploadUserSound} />
                    </div>
                  }
                />
              </Col>
            </Row>
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
              <Col md={8} sm={12} xs={24} key={`banner-${image}-${key}`}>
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

export default SettingsAlertsBlock;
