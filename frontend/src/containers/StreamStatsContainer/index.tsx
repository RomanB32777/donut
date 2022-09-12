import { ArrowLeftOutlined } from "@ant-design/icons";
import { Col, Row, Drawer } from "antd";
import { useState } from "react";
import { useSelector } from "react-redux";
import BaseButton from "../../commonComponents/BaseButton";
import BlueButton from "../../commonComponents/BlueButton";
import PageTitle from "../../commonComponents/PageTitle";
import DatesPicker from "../../components/DatesPicker";
import FormInput from "../../components/FormInput";
import LinkCopy from "../../components/LinkCopy";
import SelectInput from "../../components/SelectInput";
import { PencilIcon, TrashBinIcon } from "../../icons/icons";
import "./styles.sass";

interface IWidgetData {
  widgetTitle: string;
  widgetDescription: string;
  widgetTemplate: string;
  widgetDataType: string;
  widgetTimePeriod: string;
}

const StreamStatsContainer = () => {
  const user = useSelector((state: any) => state.user);

  const [isOpenDrawer, setIsOpenDrawer] = useState(false);
  const [formData, setFormData] = useState<IWidgetData>({
    widgetTitle: "",
    widgetDescription: "",
    widgetTemplate: "",
    widgetDataType: "Top donations",
    widgetTimePeriod: "Today",
  });

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
        <BlueButton
          formatId="create_new_form_button"
          padding="6px 35px"
          onClick={() => setIsOpenDrawer(true)}
          fontSize="18px"
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
                >
                  <PencilIcon />
                </div>
                <div>
                  <TrashBinIcon />
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </div>
      <Drawer
        width="100%"
        placement="right"
        visible={isOpenDrawer}
        closable={false}
        className="stats-drawer"
      >
        <div className="stats-drawer__header">
          <div
            className="stats-drawer__header_arrow"
            onClick={() => setIsOpenDrawer(false)}
          >
            <ArrowLeftOutlined />
          </div>
          <PageTitle
            formatId="page_title_stream_stats_create"
            notMarginBottom
          />
        </div>
        <div className="stats-drawer__form">
          <Row gutter={[0, 18]} className="form">
            <Col span={24}>
              <div className="form-element">
                <FormInput
                  label="Widget title:"
                  name="widgetTitle"
                  value={widgetTitle}
                  setValue={(value) =>
                    setFormData({ ...formData, widgetTitle: value })
                  }
                  labelCol={5}
                  InputCol={10}
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
                  labelCol={5}
                  InputCol={10}
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
                    setFormData({ ...formData, widgetDataType: value })
                  }
                  SelectCol={5}
                  InputCol={6}
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
                    setFormData({ ...formData, widgetTimePeriod: value })
                  }
                  SelectCol={5}
                  InputCol={6}
                />
                {widgetTimePeriod === "Custom date" && (
                  <div className="customDatesPicker">
                    <Row>
                      <Col offset={5}>
                        <DatesPicker />
                      </Col>
                    </Row>
                  </div>
                )}
              </div>
            </Col>

            <Col span={24}>
              <div className="form-element">
                <FormInput
                  label="Template:"
                  name="widgetTemplate"
                  descriptionInput="{username}, {sum}, {message}"
                  value={widgetTemplate}
                  setValue={(value) =>
                    setFormData({ ...formData, widgetTemplate: value })
                  }
                  labelCol={5}
                  InputCol={6}
                />
              </div>
            </Col>
          </Row>
          <div className="stats-drawer__btns">
            <div className="stats-drawer__btns_save">
              <BlueButton
                formatId="profile_form_save_widget_button"
                padding="6px 35px"
                onClick={() => console.log("dd")}
                fontSize="18px"
              />
            </div>
            <div className="stats-drawer__btns_cancel">
              <BaseButton
                formatId="profile_form_cancel_button"
                padding="6px 35px"
                onClick={() => setIsOpenDrawer(false)}
                fontSize="18px"
              />
            </div>
          </div>
        </div>
      </Drawer>
    </div>
  );
};

export default StreamStatsContainer;
