import { useEffect, useMemo, useState } from "react";
import { Empty } from "antd";
import { useDispatch } from "react-redux";
import { IGoalData } from "types";

import { useAppSelector } from "hooks/reduxHooks";
import BaseButton from "components/BaseButton";
import PageTitle from "components/PageTitle";
import GoalItem from "./components/GoalItem";
import GoalsModal from "./components/GoalsModal";

import { getGoals } from "store/types/Goals";
import { getFontsList } from "utils";
import { initWidgetGoalData } from "consts";
import { ISelectItem } from "components/SelectInput";
import { IWidgetGoalData } from "appTypes";
import "./styles.sass";

const DonationGoalsContainer = () => {
  const dispatch = useDispatch();
  const { user, goals, notifications } = useAppSelector((state) => state);
  const { list } = notifications;

  const [isOpenModal, setIsOpenModal] = useState(false);
  const [formData, setFormData] = useState<IWidgetGoalData>({
    ...initWidgetGoalData,
  });
  const [fonts, setFonts] = useState<ISelectItem[]>([]);

  const openEditModal = (widget: IWidgetGoalData) => {
    setFormData(widget);
    setIsOpenModal(true);
  };

  const activeGoals = useMemo(
    () => goals.filter((goal: IGoalData) => !goal.is_archive) || [],
    [goals]
  );
  const archivedGoals = useMemo(
    () => goals.filter((goal: IGoalData) => goal.is_archive),
    [goals]
  );

  useEffect(() => {
    const initFonts = async () => {
      const fonts = await getFontsList();
      setFonts(fonts);
    };

    if (user.id) {
      dispatch(getGoals(user.id));
      initFonts();
    }
  }, [user, list]);

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
          onClick={() => setIsOpenModal(true)}
          fontSize="18px"
          isMain
        />
      </div>
      <div className="wrapper">
        {Boolean(activeGoals.length) &&
        Boolean(activeGoals.filter((goal) => !goal.is_archive).length) ? (
          goals
            .filter((goal) => !goal.is_archive)
            .map((goal) => (
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
