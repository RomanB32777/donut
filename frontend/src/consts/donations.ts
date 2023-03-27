import { IDonation, ISendDonat } from "types";

const initSendDonatData: ISendDonat = {
  blockchain: "MATIC",
  isAnonymous: false,
  username: "",
  message: "",
  sum: 0,
};

const initDonationData: IDonation = {
  id: "",
  blockchain: "MATIC",
  backer: "",
  creator: "",
  sum: 0,
  createdAt: new Date(),
  message: "",
  isAnonymous: false,
};

export { initSendDonatData, initDonationData };
