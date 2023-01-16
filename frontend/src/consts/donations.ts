import { IDonation, ISendDonat } from "types";

const initSendDonatData: ISendDonat = {
  message: "",
  username: "",
  amount: 0,
  selectedBlockchain: "ETHs",
  selectedGoal: 0,
  is_anonymous: false,
};

const initDonationData: IDonation = {
  id: 0,
  blockchain: "evmos",
  backer_id: 0,
  creator_id: 0,
  sum_donation: 0,
  created_at: "",
  donation_message: "",
};

export { initSendDonatData, initDonationData };
