import { useEffect, useState } from "react";
import { Empty } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { IStatData } from "types";

import BaseButton from "../../../components/BaseButton";
import PageTitle from "../../../components/PageTitle";
import StatsModal from "./components/StatsModal";
import StatsItem from "./components/StatsItem";

import { getStats } from "../../../store/types/Stats";
import { initWidgetStatData } from "consts";
import { IWidgetStatData } from "appTypes";
import "./styles.sass";

const StreamStatsContainer = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: any) => state.user);
  const stats = useSelector((state: any) => state.stats);

  const [isOpenModal, setIsOpenModal] = useState(false);
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

  useEffect(() => {
    user.id && dispatch(getStats(user.id));
  }, [user]);

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
      <StatsModal
        formData={formData}
        isOpenModal={isOpenModal}
        setFormData={setFormData}
        setIsOpenModal={setIsOpenModal}
      />
    </div>
  );
};

export default StreamStatsContainer;
