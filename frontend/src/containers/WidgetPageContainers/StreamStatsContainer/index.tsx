import { useEffect, useState } from "react";
import { Empty } from "antd";
import { useDispatch } from "react-redux";
import { IStatData } from "types";

import { useAppSelector } from "hooks/reduxHooks";
import BaseButton from "components/BaseButton";
import PageTitle from "components/PageTitle";
import StatsModal from "./components/StatsModal";
import StatsItem from "./components/StatsItem";

import { getStats } from "store/types/Stats";
import { getFontsList } from "utils";
import { initWidgetStatData } from "consts";
import { ISelectItem } from "components/SelectInput";
import { IWidgetStatData } from "appTypes";
import "./styles.sass";

const StreamStatsContainer = () => {
  const dispatch = useDispatch();
  const { user, stats } = useAppSelector((state) => state);

  const [isOpenModal, setIsOpenModal] = useState(false);
  const [fonts, setFonts] = useState<ISelectItem[]>([]);
  const [formData, setFormData] = useState<IWidgetStatData>({
    ...initWidgetStatData,
  });

  const openEditModal = (widget: IWidgetStatData) => {
    const { template } = widget;
    setFormData({
      ...widget,
      template: (template as string).split(" "),
    });
    setIsOpenModal(true);
  };

  useEffect(() => {
    const initFonts = async () => {
      const fonts = await getFontsList();
      setFonts(fonts);
    };

    const { id } = user;
    if (id) {
      dispatch(getStats(user.id));
      initFonts();
    }
  }, [user]);

  return (
    <div className="streamStatsPage-container stats fadeIn">
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
          stats.map((widget: IStatData) => (
            <StatsItem
              key={widget.id}
              fonts={fonts}
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
