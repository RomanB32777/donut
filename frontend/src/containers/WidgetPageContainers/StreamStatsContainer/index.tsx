import { useCallback, useEffect, useState } from "react";
import { Empty } from "antd";
import { IStatData } from "types";

import { useAppSelector } from "hooks/reduxHooks";
import BaseButton from "components/BaseButton";
import PageTitle from "components/PageTitle";
import StatsModal from "./components/StatsModal";
import StatsItem from "./components/StatsItem";
import Loader from "components/Loader";

import { useGetStatsQuery } from "store/services/StatsService";
import { getFontsList } from "utils";
import { initWidgetStatData } from "consts";
import { ISelectItem } from "components/SelectInput";
import { IWidgetStatData } from "appTypes";
import "./styles.sass";

const StreamStatsContainer = () => {
  const { id } = useAppSelector(({ user }) => user);

  const [isOpenModal, setIsOpenModal] = useState(false);
  const [fonts, setFonts] = useState<ISelectItem[]>([]);
  const [formData, setFormData] = useState<IWidgetStatData>({
    ...initWidgetStatData,
  });

  const { data: stats, isLoading } = useGetStatsQuery(id, { skip: !id });

  const openCreateModal = useCallback(() => setIsOpenModal(true), []);

  const openEditModal = useCallback((widget: IWidgetStatData) => {
    const { template } = widget;
    setFormData({
      ...widget,
      // time_period: isCustomDate ? "custom" : time_period,
      // custom_period: isCustomDate ? time_period : "",
      template: (template as string).split(" "),
    });

    // const isCustomDate = time_period.includes("/");
    // const formatValues = time_period
    //   .split("-")
    //   .map((d) => dayjsModule(dayjsModule(d).format("DD/MM/YYYY")));

    // console.log(
    //   time_period.split("-"),
    //   dayjsModule("12/02/2023"),
    //   formatValues
    // );
    setIsOpenModal(true);
  }, []);

  useEffect(() => {
    const initFonts = async () => {
      const fonts = await getFontsList();
      setFonts(fonts);
    };

    initFonts();
  }, []);

  if (isLoading) return <Loader size="small" />;

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
          onClick={openCreateModal}
          fontSize="18px"
          isMain
        />
      </div>
      <div className="stats-wrapper">
        {stats && Boolean(stats.length) ? (
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
