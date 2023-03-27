import { useCallback, useEffect, useState } from "react";
import { Col, Row } from "antd";
import { FormattedMessage } from "react-intl";
import { gendersType } from "types";

import ModalComponent from "components/ModalComponent";
import ColorPicker from "components/ColorPicker";
import UploadImage, { UploadAfterEl } from "components/UploadImage";
import SelectInput, { ISelectItem } from "components/SelectInput";
import TabsComponent from "components/TabsComponent";
import SliderForm from "components/SliderForm";
import SwitchForm from "components/SwitchForm";
import SelectComponent from "components/SelectComponent";
import {
  FontStyleElement,
  FontSelectOption,
} from "components/SelectInput/options/FontSelectOption";
import UploadSound from "./UploadSound";

import {
  useGetSoundsQuery,
  useLazyGetDefaultImagesQuery,
} from "store/services/FilesService";
import { useUploadSoundMutation } from "store/services/AlertsService";
import { dummyImg, notVisibleFontsCount } from "consts";
import { IAlert, IDefaultImagesModal } from "appTypes";

const alertSound = new Audio();

const voiceTabs = [
  {
    key: "MALE",
    label: <FormattedMessage id="alerts_voice_male" />,
  },
  {
    key: "FEMALE",
    label: <FormattedMessage id="alerts_voice_female" />,
  },
];

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
    messageColor,
    messageFont,
    nameColor,
    nameFont,
    sumColor,
    sumFont,
    duration,
    sound,
    voice,
    genderVoice,
  } = formData;

  const [modalInfo, setModalInfo] = useState<IDefaultImagesModal>({
    isOpen: false,
    images: [],
  });
  const [fontList, setFontList] = useState<ISelectItem[]>([]);

  const { isOpen, images } = modalInfo;

  const [getDefaultImages] = useLazyGetDefaultImagesQuery();
  const [uploadSound] = useUploadSoundMutation();
  const { data: soundsList, refetch: getSounds } = useGetSoundsQuery();

  const openDefaultImages = async () => {
    const { data: images } = await getDefaultImages("alert");
    images &&
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

  const onOpenFontSelect = (isOpen: boolean) => isOpen && setFontList(fonts);

  const playSound = (soundLink: string) => {
    if (alertSound) {
      alertSound.pause();
      alertSound.src = soundLink;
      alertSound.play();
    }
  };

  const uploadUserSound = async (file: File) => {
    try {
      const uploadedSound = await uploadSound({
        sound: file,
      }).unwrap();
      if (uploadedSound) {
        const { path } = uploadedSound;
        playSound(path);
        getSounds();
        setFormData({
          ...formData,
          sound: uploadedSound,
        });
      }
    } catch (error) {
      console.error("rejected", error);
    }
  };

  const selectSound = (selected: string) => {
    const soundInfo = soundsList?.find((s) => s.name === selected);

    if (soundInfo) {
      playSound(soundInfo.path);

      setFormData({
        ...formData,
        sound: soundInfo,
      });
    }
  };

  const voiseTabsHandler = useCallback(
    (key: string) =>
      setFormData({ ...formData, genderVoice: key as gendersType }),
    [formData, setFormData]
  );

  useEffect(() => {
    fonts.length && setFontList(fonts.slice(0, notVisibleFontsCount));
  }, [fonts]);

  return (
    <Col xl={13} md={24}>
      <Row gutter={[0, 18]} className="form">
        <Col span={24}>
          <div className="form-element">
            <UploadImage
              label={<FormattedMessage id="alerts_banner" />}
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
                  alsoText={<FormattedMessage id="upload_choose_or_banners" />}
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
              name="alerts_message_color"
              setColor={(color) =>
                setFormData({ ...formData, messageColor: color })
              }
              color={messageColor}
              label={<FormattedMessage id="alerts_message_color" />}
              labelCol={8}
              inputCol={14}
              gutter={[0, 18]}
            />
          </div>
        </Col>
        <Col span={24}>
          <div className="form-element">
            <ColorPicker
              name="alerts_name_color"
              setColor={(color) =>
                setFormData({ ...formData, nameColor: color })
              }
              color={nameColor}
              label={<FormattedMessage id="alerts_name_color" />}
              labelCol={8}
              inputCol={14}
              gutter={[0, 18]}
            />
          </div>
        </Col>
        <Col span={24}>
          <div className="form-element">
            <ColorPicker
              name="alerts_sum_color"
              setColor={(color) =>
                setFormData({ ...formData, sumColor: color })
              }
              color={sumColor}
              label={<FormattedMessage id="alerts_sum_color" />}
              labelCol={8}
              inputCol={14}
              gutter={[0, 18]}
            />
          </div>
        </Col>
        <Col span={24}>
          <div className="form-element">
            <SelectInput
              label={<FormattedMessage id="alerts_message_font" />}
              value={{
                value: messageFont.name,
                label: <FontStyleElement fontName={messageFont.name} />,
              }}
              list={fontList}
              modificator="form-select"
              onChange={({ value }, option) =>
                setFormData({
                  ...formData,
                  messageFont: {
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
              label={<FormattedMessage id="alerts_supporter_font" />}
              value={{
                value: nameFont.name,
                label: <FontStyleElement fontName={nameFont.name} />,
              }}
              list={fontList}
              modificator="form-select"
              onChange={({ value }, option) =>
                setFormData({
                  ...formData,
                  nameFont: {
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
              label={<FormattedMessage id="alerts_donation_font" />}
              value={{
                value: sumFont.name,
                label: <FontStyleElement fontName={sumFont.name} />,
              }}
              list={fontList}
              modificator="form-select"
              onChange={({ value }, option) =>
                setFormData({
                  ...formData,
                  sumFont: {
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
        {soundsList && (
          <Col span={24}>
            <div className="form-element">
              <Row gutter={[0, 18]} align="middle">
                <Col md={8} xs={24}>
                  <span className="form-element__label">
                    <FormattedMessage id="alerts_sound" />
                  </span>
                </Col>
                <Col md={14} xs={24}>
                  <SelectComponent
                    title={sound.name}
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
        )}
        <Col span={24}>
          <div className="form-element">
            <SliderForm
              label={<FormattedMessage id="alerts_duration" />}
              step={1}
              max={10}
              min={3}
              setValue={(num) => setFormData({ ...formData, duration: num })}
              value={+duration}
              maxWidth={250}
              description={
                <FormattedMessage
                  id="alerts_duration_value"
                  values={{ duration }}
                />
              }
              labelCol={8}
              sliderCol={14}
              gutter={[0, 18]}
            />
          </div>
        </Col>
        <Col span={24}>
          <div className="form-element">
            <SwitchForm
              label={<FormattedMessage id="alerts_voice" />}
              checked={voice}
              setValue={(flag) => setFormData({ ...formData, voice: flag })}
              maxWidth={250}
              labelCol={8}
              switchCol={14}
              gutter={[0, 18]}
              afterComponent={
                voice ? (
                  <TabsComponent
                    setTabContent={voiseTabsHandler}
                    activeKey={genderVoice}
                    tabs={voiceTabs}
                  />
                ) : null
              }
              isVisibleStatus
            />
          </div>
        </Col>
        <ModalComponent
          open={isOpen}
          title={<FormattedMessage id="alerts_banners_model" />}
          width={900}
          onCancel={closeModal}
          className="alert-modal"
          topModal
        >
          <Row gutter={[16, 32]} justify="space-between">
            {images.map(({ name, path }, key) => (
              <Col md={8} sm={12} xs={24} key={`banner-${name}-${key}`}>
                <div
                  className="default-banner"
                  onClick={() => selectDefaultBanner(path)}
                >
                  <img src={path} alt={`banner-${key}`} />
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
