import { useEffect, useMemo, useState } from "react";
import { Col, Empty, Row } from "antd";
import { useDispatch, useSelector } from "react-redux";
import {
  IStatData,
  allPeriodItemsTypes,
  statsDataTypes,
  ICurrentPeriodItemsTypes,
} from "types";

import BaseButton from "../../../components/BaseButton";
import PageTitle from "../../../components/PageTitle";
import FormInput from "../../../components/FormInput";
import ModalComponent from "../../../components/ModalComponent";
import SelectInput, { ISelectItem } from "../../../components/SelectInput";
import StatsItem from "./StatsItem";
import DatesPicker from "../../../components/DatesPicker";
import axiosClient from "../../../axiosClient";
import useWindowDimensions from "../../../hooks/useWindowDimensions";
import { addNotification, addSuccessNotification } from "../../../utils";
import { getStats } from "../../../store/types/Stats";
import {
  filterDataTypeItems,
  filterCurrentPeriodItems,
} from "../../../utils/dateMethods/consts";
import "./styles.sass";

type keyPeriodItems = keyof ICurrentPeriodItemsTypes;

interface IWidgetStatData {
  title: string;
  stat_description: string;
  template: string | string[];
  data_type: string; // value of statsDataTypes ???
  time_period: keyPeriodItems;
  custom_period?: string;
  id?: number;
}

const initWidgetStatData: IWidgetStatData = {
  id: 0,
  title: "",
  stat_description: "",
  template: [],
  data_type: "top-donations", // filterDataTypeItems["top-donations"]
  time_period: "today", // "Today"
  custom_period: "",
};

const templates = ["{username}", "{sum}", "{message}"];

const templateList: ISelectItem[] = templates.map((tName) => ({
  value: tName,
  key: tName,
}));

const StreamStatsContainer = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: any) => state.user);
  const stats = useSelector((state: any) => state.stats);

  const [isOpenModal, setIsOpenModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<IWidgetStatData>({
    ...initWidgetStatData,
  });
  const { isMobile } = useWindowDimensions();

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
      const {
        id,
        title,
        stat_description,
        template,
        data_type,
        time_period,
        custom_period,
      } = formData;

      const timePeriod = time_period === "custom" ? custom_period : time_period;

      id
        ? await axiosClient.put("/api/widget/stats-widget/", {
            statData: {
              title,
              stat_description,
              template: (template as string[]).join(" "),
              data_type,
              time_period: timePeriod,
            },
            id,
          })
        : await axiosClient.post("/api/widget/stats-widget/", {
            title,
            stat_description,
            template: (template as string[]).join(" "),
            data_type,
            time_period: timePeriod,
            creator_id: user.id,
          });
      dispatch(getStats(user.id));
      setIsOpenModal(false);
      setFormData({
        ...initWidgetStatData,
      });
      addSuccessNotification({ message: "Data created successfully" });
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
        ? templateList.filter((t) => t.key !== "{message}")
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
          isMain
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
        open={isOpenModal}
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
                  inputCol={16}
                  gutter={[0, 18]}
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
                  inputCol={16}
                  gutter={[0, 18]}
                  isTextarea
                />
              </div>
            </Col>
            <Col span={24}>
              <div className="form-element">
                <SelectInput
                  label="Data type:"
                  list={Object.keys(filterDataTypeItems).map((key) => ({
                    key,
                    value: filterDataTypeItems[key as statsDataTypes],
                  }))}
                  value={data_type}
                  setValue={(value) =>
                    setFormData({
                      ...formData,
                      data_type: value as string,
                    })
                  }
                  labelCol={6}
                  selectCol={16}
                  gutter={[0, 18]}
                />
              </div>
            </Col>
            <Col span={24}>
              <div className="form-element">
                <SelectInput
                  label="Time period:"
                  list={Object.keys(filterCurrentPeriodItems).map((key) => ({
                    key,
                    value: filterCurrentPeriodItems[key as allPeriodItemsTypes],
                  }))}
                  value={time_period}
                  setValue={(value) =>
                    setFormData({
                      ...formData,
                      time_period: value as keyPeriodItems,
                    })
                  }
                  labelCol={6}
                  selectCol={16}
                  gutter={[0, 18]}
                />
                {time_period === "custom" && (
                  <div className="customDatesPicker">
                    <Row>
                      <Col offset={isMobile ? 0 : 6}>
                        <DatesPicker
                          setValue={(startDate, endDate) =>
                            setFormData({
                              ...formData,
                              time_period: "custom",
                              custom_period: `${startDate}-${endDate}`,
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
                  value={currTemplate}
                  setValue={(value) =>
                    setFormData({
                      ...formData,
                      template: value as string[],
                    })
                  }
                  descriptionSelect={currTemplateList
                    .map((t) => t.value)
                    .join(", ")}
                  selectCol={16}
                  labelCol={6}
                  gutter={[0, 18]}
                  isTags
                />
              </div>
            </Col>
          </Row>
          <div className="stats-modal__btns">
            <div className="stats-modal__btns_cancel">
              <BaseButton
                formatId="profile_form_cancel_button"
                padding="6px 35px"
                onClick={closeEditModal}
                fontSize="18px"
              />
            </div>
            <div className="stats-modal__btns_save">
              <BaseButton
                formatId="profile_form_save_widget_button"
                padding="6px 35px"
                onClick={sendData}
                disabled={loading}
                fontSize="18px"
                isMain
              />
            </div>
          </div>
        </div>
      </ModalComponent>
    </div>
  );
};

export default StreamStatsContainer;
