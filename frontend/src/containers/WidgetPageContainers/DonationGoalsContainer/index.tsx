import { useCallback, useEffect, useMemo, useState } from "react";
import { Empty } from "antd";
import { IGoalData } from "types";

import { useAppSelector } from "hooks/reduxHooks";
import BaseButton from "components/BaseButton";
import PageTitle from "components/PageTitle";
import GoalItem from "./components/GoalItem";
import GoalsModal from "./components/GoalsModal";

import { useGetGoalsQuery } from "store/services/GoalsService";
import { getFontsList } from "utils";
import { initWidgetGoalData } from "consts";
import { ISelectItem } from "components/SelectInput";
import { IWidgetGoalData } from "appTypes";
import "./styles.sass";

const DonationGoalsContainer = () => {
  const { id } = useAppSelector(({ user }) => user);
  const { list } = useAppSelector(({ notifications }) => notifications);

  const [isOpenModal, setIsOpenModal] = useState(false);
  const [formData, setFormData] = useState<IWidgetGoalData>(initWidgetGoalData);
  const [fonts, setFonts] = useState<ISelectItem[]>([]);

  const { data: goals, refetch } = useGetGoalsQuery(id, { skip: !id });

  const openEditModal = useCallback((widget: IWidgetGoalData) => {
    setFormData(widget);
    setIsOpenModal(true);
  }, []);

  const openCreateModal = useCallback(() => {
    setFormData(initWidgetGoalData);
    setIsOpenModal(true);
  }, []);

  const activeGoals = useMemo(
    () => (goals ? goals.filter((goal: IGoalData) => !goal.is_archive) : []),
    [goals]
  );

  const archivedGoals = useMemo(
    () => (goals ? goals.filter((goal: IGoalData) => goal.is_archive) : []),
    [goals]
  );

  useEffect(() => {
    const initFonts = async () => {
      const fonts = await getFontsList();
      setFonts(fonts);
    };

    initFonts();
  }, []);

  useEffect(() => {
    // list.length &&
    refetch();
  }, [list]);

  return (
    <div className="goals fadeIn">
      <PageTitle formatId="page_title_donation_goals" />
      <div className="headerPage">
        <p className="subtitle">
          Start fundraising for a specific purchase or goal.
        </p>
        <BaseButton
          formatId="create_new_form_button"
          padding="6px 35px"
          onClick={openCreateModal}
          fontSize="18px"
          isMain
        />
      </div>
      <div className="wrapper">
        {Boolean(activeGoals.length) ? (
          activeGoals.map((goal) => (
            <GoalItem
              key={goal.id}
              fonts={fonts}
              goalData={goal}
              openEditModal={openEditModal}
            />
          ))
        ) : (
          <Empty className="empty-el" image={Empty.PRESENTED_IMAGE_SIMPLE} />
        )}
      </div>
      <PageTitle formatId="page_title_donation_history" />
      <div className="archiveWrapper">
        {Boolean(archivedGoals.length) ? (
          archivedGoals.map((goal: IGoalData) => (
            <GoalItem key={goal.id} goalData={goal} fonts={[]} />
          ))
        ) : (
          <Empty className="empty-el" image={Empty.PRESENTED_IMAGE_SIMPLE} />
        )}
      </div>
      <GoalsModal
        formData={formData}
        isOpenModal={isOpenModal}
        setFormData={setFormData}
        setIsOpenModal={setIsOpenModal}
      />
    </div>
  );
};

export default DonationGoalsContainer;
