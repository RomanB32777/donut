import { IBadgeInfo } from "types";
import { IBadge } from "appTypes";

const initBadgeData: IBadge = {
  id: 0,
  title: "",
  description: "",
  image: {
    preview: "",
    file: null,
  },
  blockchain: "polygon",
  creator_id: 0,
};

const initBadgeDataWithoutFile: IBadgeInfo = {
  id: 0,
  title: "",
  description: "",
  image: "",
  blockchain: "polygon",
  creator_id: 0,
};

export { initBadgeData, initBadgeDataWithoutFile };
