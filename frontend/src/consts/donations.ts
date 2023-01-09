import { IDonation, ISendDonat } from "types";

const initSendDonatData: ISendDonat = {
  message: "",
  username: "",
  amount: 0,
  selectedBlockchain: "evmos",
  selectedGoal: 0,
  isAnonymous: true,
};

const initDonationData: IDonation = {
  id: 0,
  blockchain: "evmos",
  backer_id: 0,
  creator_id: 0,
  sum_donation: 0,
  donation_date: "",
  donation_message: "",
};

export { initSendDonatData, initDonationData };
