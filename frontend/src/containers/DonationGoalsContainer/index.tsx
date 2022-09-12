import { useState } from "react";
import BlueButton from "../../commonComponents/BlueButton";
import PageTitle from "../../commonComponents/PageTitle";
import GoalItem from "./GoalItem";

import "./styles.sass";

const DonationGoalsContainer = () => {
  const [isOpenDrawer, setIsOpenDrawer] = useState(false);

  const testData = {
    goalTitleColor: "#ffffff",
    progressBarColor: "#1D14FF",
    backgroundColor: "#212127",
  };

  return (
    <div className="donationGoalsPage-container">
      <PageTitle formatId="page_title_donation_goals" />
      <div className="goals-header">
        <p className="subtitle">
          Lorem ipsum dolor sit amet consectetur adipisicing elit.
        </p>
        <BlueButton
          formatId="create_new_form_button"
          padding="6px 35px"
          onClick={() => setIsOpenDrawer(true)}
          fontSize="18px"
        />
      </div>
      <div className="goals-wrapper">
        <GoalItem goalData={testData} />
      </div>
      <PageTitle formatId="page_title_donation_history" />
      <div className="goals-archiveWrapper">
        <GoalItem goalData={testData} isArchive />
      </div>
    </div>
  );
};

export default DonationGoalsContainer;
