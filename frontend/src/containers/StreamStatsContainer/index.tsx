import { useState } from "react";
import { Col, Row } from "antd";
import { useSelector } from "react-redux";
import BaseButton from "../../commonComponents/BaseButton";
import PageTitle from "../../commonComponents/PageTitle";
import DatesPicker from "../../components/DatesPicker";
import FormInput from "../../components/FormInput";
import LinkCopy from "../../components/LinkCopy";
import ModalComponent from "../../components/ModalComponent";
import SelectInput from "../../components/SelectInput";
import ConfirmPopup from "../../components/ConfirmPopup";
import { PencilIcon, TrashBinIcon } from "../../icons/icons";
import "./styles.sass";

interface IWidgetData {
  widgetTitle: string;
  widgetDescription: string;
  widgetTemplate: string[];
  widgetDataType: string;
  widgetTimePeriod: string;
}

const templateList = ["{username}", "{sum}", "{message}"];

const StreamStatsContainer = () => {
  const user = useSelector((state: any) => state.user);

  const [isOpenModal, setIsOpenModal] = useState(false);
  const [formData, setFormData] = useState<IWidgetData>({
    widgetTitle: "",
    widgetDescription: "",
    widgetTemplate: [],
    widgetDataType: "Top donations",
    widgetTimePeriod: "Today",
  });

  const clickEditBtn = (event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
    setIsOpenModal(true);
  };

  const {
    widgetTitle,
    widgetDescription,
    widgetTemplate,
    widgetDataType,
    widgetTimePeriod,
  } = formData;

  return (
    <div className="streamStatsPage-container stats">
      <PageTitle formatId="page_title_stream_stats" />
      <div className="stats-header">
        <p className="subtitle">
          Create your custom widgets to display on your streams
        </p>
        <BaseButton
          formatId="create_new_form_button"
          padding="6px 35px"
          onClick={() => setIsOpenModal(true)}
          fontSize="18px"
          isBlue
        />
      </div>
      <div className="stats-wrapper">
        <div className="stats-item">
          <Row>
            <Col span={11}>
              <div className="stats-item__mainInfo">
                <p className="stats-item__mainInfo_title">
                  My top donations all time
                </p>
                <p className="stats-item__mainInfo_description">
                  I need this widget to display in the right corner of my stream
                </p>
              </div>
            </Col>
            <Col span={12}>
              <div className="stats-item__parameters">
                <p>Date period: 01/08/2022 - 31/08/2022</p>
                <p>Date type: Top supporters</p>
                <p>Template: username - donation</p>
                <LinkCopy
                  link={
                    "http://localhost:5000/donat-message/undefined/undefined"
                  }
                  isSimple
                />
              </div>
            </Col>
            <Col span={1}>
              <div className="stats-item__btns">
                <div
                  style={{
                    marginRight: 5,
                  }}
                  onClick={clickEditBtn}
                >
                  <PencilIcon />
                </div>
                <ConfirmPopup confirm={() => console.log()}>
                  <div style={{ marginLeft: 5 }}>
                    <TrashBinIcon />
                  </div>
                </ConfirmPopup>
              </div>
            </Col>
          </Row>
        </div>
      </div>

      <ModalComponent
        visible={isOpenModal}
        title="New widget creation"
        setIsVisible={setIsOpenModal}
        width={880}
        topModal
      >
        <div className="stats-modal">
          <Row gutter={[0, 18]} className="stats-modal__form" justify="center">
            <Col span={24}>
              <div className="form-element">
                <FormInput
                  label="Widget title:"
                  name="widgetTitle"
                  value={widgetTitle}
                  setValue={(value) =>
                    setFormData({ ...formData, widgetTitle: value })
                  }
                  labelCol={6}
                  InputCol={16}
                />
              </div>
            </Col>
            <Col span={24}>
              <div className="form-element">
                <FormInput
                  label="Widget description:"
                  name="widgetDescription"
                  value={widgetDescription}
                  setValue={(value) =>
                    setFormData({ ...formData, widgetDescription: value })
                  }
                  labelCol={6}
                  InputCol={16}
                  isTextarea
                />
              </div>
            </Col>
            <Col span={24}>
              <div className="form-element">
                <SelectInput
                  label="Data type:"
                  list={["Top donations", "Top supporters", "Recent donations"]}
                  value={widgetDataType}
                  setValue={(value) =>
                    setFormData({
                      ...formData,
                      widgetDataType: value as string,
                    })
                  }
                  labelCol={6}
                  selectCol={16}
                />
              </div>
            </Col>
            <Col span={24}>
              <div className="form-element">
                <SelectInput
                  label="Time period:"
                  list={[
                    "Today",
                    "Yesterday",
                    "Current week",
                    "Current month",
                    "Current year",
                    "All time",
                    "Custom date",
                  ]}
                  value={widgetTimePeriod}
                  setValue={(value) =>
                    setFormData({
                      ...formData,
                      widgetTimePeriod: value as string,
                    })
                  }
                  labelCol={6}
                  selectCol={16}
                />
                {widgetTimePeriod === "Custom date" && (
                  <div className="customDatesPicker">
                    <Row>
                      <Col offset={6}>
                        <DatesPicker />
                      </Col>
                    </Row>
                  </div>
                )}
              </div>
            </Col>
            <Col span={24}>
              <div className="form-element">
                <SelectInput
                  label="Template:"
                  list={templateList}
                  value={widgetTemplate}
                  setValue={(value) =>
                    setFormData({
                      ...formData,
                      widgetTemplate: value as string[],
                    })
                  }
                  descriptionSelect={templateList.join(", ")}
                  selectCol={16}
                  labelCol={6}
                  isTags
                />
              </div>
            </Col>
          </Row>
          <div className="stats-modal__btns">
            <div className="stats-modal__btns_save">
              <BaseButton
                formatId="profile_form_save_widget_button"
                padding="6px 35px"
                onClick={() => console.log("dd")}
                fontSize="18px"
                isBlue
              />
            </div>
            <div className="stats-modal__btns_cancel">
              <BaseButton
                formatId="profile_form_cancel_button"
                padding="6px 35px"
                onClick={() => setIsOpenModal(false)}
                fontSize="18px"
              />
            </div>
          </div>
        </div>
      </ModalComponent>
    </div>
  );
};

export default StreamStatsContainer;
