import { useEffect, useMemo, useState } from "react";
import { Col, Empty, Row } from "antd";
import { useDispatch, useSelector } from "react-redux";
import BaseButton from "../../commonComponents/BaseButton";
import PageTitle from "../../commonComponents/PageTitle";
import FormInput from "../../components/FormInput";
import ModalComponent from "../../components/ModalComponent";
import SelectInput from "../../components/SelectInput";
import { IStatData } from "../../types";
import StatsItem from "./StatsItem";
import DatesPicker from "../../components/DatesPicker";
import axiosClient from "../../axiosClient";
import { addNotification, addSuccessNotification } from "../../utils";
import { getStats } from "../../store/types/Stats";
import { filterCurrentPeriodItems, filterDataTypeItems } from "../../consts";
import "./styles.sass";

interface IWidgetStatData {
  title: string;
  stat_description: string;
  template: string | string[];
  data_type: string; // value of statsDataTypes ???
  time_period: string;
  id?: number;
}
const initWidgetStatData: IWidgetStatData = {
  id: 0,
  title: "",
  stat_description: "",
  template: [],
  data_type: filterDataTypeItems["top-donations"],
  time_period: "Today",
};

const templateList = ["{username}", "{sum}", "{message}"];

const StreamStatsContainer = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: any) => state.user);
  const stats = useSelector((state: any) => state.stats);

  const [isOpenModal, setIsOpenModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<IWidgetStatData>({
    ...initWidgetStatData,
  });

  const openEditModal = (widget: IWidgetStatData) => {
    const { id, title, stat_description, template, data_type, time_period } =
      widget;
    setFormData({
      id,
      title,
      stat_description,
      template: (template as string).split(" "),
      data_type,
      time_period,
    });
    setIsOpenModal(true);
  };

  const closeEditModal = () => {
    setFormData({
      ...initWidgetStatData,
    });
    setIsOpenModal(false);
  };

  const sendData = async () => {
    try {
      setLoading(true);
      const { id, title, stat_description, template, data_type, time_period } =
        formData;

      id
        ? await axiosClient.put("/api/user/stats-widget/", {
            statData: {
              title,
              stat_description,
              template: (template as string[]).join(" "),
              data_type,
              time_period,
            },
            id,
          })
        : await axiosClient.post("/api/user/stats-widget/", {
            title,
            stat_description,
            template: (template as string[]).join(" "),
            data_type,
            time_period,
            creator_id: user.id,
          });
      dispatch(getStats(user.id));
      setIsOpenModal(false);
      setFormData({
        ...initWidgetStatData,
      });
      addSuccessNotification("Data created successfully");
    } catch (error) {
      addNotification({
        type: "danger",
        title: "Error",
        message:
          (error as any)?.response?.data?.message ||
          `An error occurred while creating data`,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    user.id && dispatch(getStats(user.id));
  }, [user]);

  const { title, stat_description, template, data_type, time_period } =
    formData;

  const currTemplateList = useMemo(
    () =>
      data_type === filterDataTypeItems["top-supporters"]
        ? templateList.filter((t) => t !== "{message}")
        : templateList,
    [data_type]
  );

  const currTemplate = useMemo(
    () =>
      data_type === filterDataTypeItems["top-supporters"]
        ? (template as string[]).filter((t) => t !== "{message}")
        : template,
    [data_type, template]
  );

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
        {Boolean(stats.length) ? (
          stats
            .reverse()
            .map((widget: IStatData) => (
              <StatsItem
                key={widget.id}
                statData={widget}
                openEditModal={openEditModal}
              />
            ))
        ) : (
          <Empty className="empty-el" image={Empty.PRESENTED_IMAGE_SIMPLE} />
        )}
      </div>
      <ModalComponent
        visible={isOpenModal}
        title="New widget creation"
        onCancel={closeEditModal}
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
                  value={title}
                  setValue={(value) =>
                    setFormData({ ...formData, title: value })
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
                  name="stat_description"
                  value={stat_description}
                  setValue={(value) =>
                    setFormData({ ...formData, stat_description: value })
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
                  list={Object.values(filterDataTypeItems)}
                  value={data_type}
                  setValue={(value) =>
                    setFormData({
                      ...formData,
                      data_type: value as string,
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
                  list={Object.values(filterCurrentPeriodItems)}
                  value={time_period}
                  setValue={(value) =>
                    setFormData({
                      ...formData,
                      time_period: value as string,
                    })
                  }
                  labelCol={6}
                  selectCol={16}
                />
                {time_period === "Custom date" && (
                  <div className="customDatesPicker">
                    <Row>
                      <Col offset={6}>
                        <DatesPicker
                          setValue={(startDate, endDate) =>
                            setFormData({
                              ...formData,
                              time_period: `${startDate}-${endDate}`,
                            })
                          }
                        />
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
                  list={currTemplateList}
                  value={currTemplate} //
                  setValue={(value) =>
                    setFormData({
                      ...formData,
                      template: value as string[],
                    })
                  }
                  descriptionSelect={currTemplateList.join(", ")}
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
                onClick={sendData}
                disabled={loading}
                fontSize="18px"
                isBlue
              />
            </div>
            <div className="stats-modal__btns_cancel">
              <BaseButton
                formatId="profile_form_cancel_button"
                padding="6px 35px"
                onClick={closeEditModal}
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
