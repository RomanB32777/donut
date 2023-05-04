import { useCallback, useEffect, useState } from "react";
import { FormattedMessage } from "react-intl";
import { IStatData } from "types";

import BaseButton from "components/BaseButton";
import PageTitle from "components/PageTitle";
import StatsModal from "./components/StatsModal";
import StatsItem from "./components/StatsItem";
import Loader from "components/Loader";
import EmptyComponent from "components/EmptyComponent";

import { useGetStatsQuery } from "store/services/StatsService";
import { getFontsList } from "utils";
import { initWidgetStatData } from "consts";
import { ISelectItem } from "components/SelectInput";
import { IWidgetStatData } from "appTypes";
import "./styles.sass";

const StreamStatsContainer = () => {
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [fonts, setFonts] = useState<ISelectItem[]>([]);
  const [formData, setFormData] = useState<IWidgetStatData>({
    ...initWidgetStatData,
  });

  const { data: stats, isLoading } = useGetStatsQuery();

  const openCreateModal = useCallback(() => setIsOpenModal(true), []);

  const openEditModal = useCallback((widget: IWidgetStatData) => {
    const { template } = widget;
    setFormData({
      ...widget,
      // timePeriod: isCustomDate ? "custom" : timePeriod,
      // customPeriod: isCustomDate ? timePeriod : "",
      template: (template as string).split(" "),
    });

    // const isCustomDate = timePeriod.includes("/");
    // const formatValues = timePeriod
    //   .split("-")
    //   .map((d) => dayjsModule(dayjsModule(d).format("DD/MM/YYYY")));

    // console.log(
    //   timePeriod.split("-"),
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
          <FormattedMessage id="stats_subtitle" />
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
          <EmptyComponent />
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
