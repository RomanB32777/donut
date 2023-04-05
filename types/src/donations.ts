import { allPeriodItemsTypes } from "./dates";
import { userRoles } from "./user";

interface IDonationShortInfo {
  sum: number;
  blockchain: string;
  message: string;
}

interface IDonation extends IDonationShortInfo {
  id: string;
  createdAt: Date;
  backer: string;
  creator: string;
  isAnonymous: boolean;
  goal?: {
    id: string;
  };
}

type socketNotificationTypes = "donat" | "add_badge";

interface ISocketNotification<T = IDonationShortInfo> {
  type: socketNotificationTypes;
  supporter: string;
  additional: T;
}

interface ISendDonat extends IDonationShortInfo {
  username: string;
  goal?: string | null;
  isAnonymous: boolean;
}

interface IFullSendDonat extends ISendDonat {
  creator: string;
  backer: string;
}

interface IDonationsQueryData<TimePeriod = allPeriodItemsTypes> {
  limit: number;
  offset: number;
  timePeriod: TimePeriod;
  roleplay: userRoles;
  spamFilter: boolean;
  endDate: string;
  startDate: string;
  searchStr: string;
  groupByName: boolean;
}

type donationsQueryData<TimePeriod = allPeriodItemsTypes> = Partial<
  IDonationsQueryData<TimePeriod>
>;

type sendDonatFieldsKeys = keyof ISendDonat;

export type {
  IDonationShortInfo,
  IDonation,
  socketNotificationTypes,
  ISocketNotification,
  ISendDonat,
  IFullSendDonat,
  IDonationsQueryData,
  donationsQueryData,
  sendDonatFieldsKeys,
};
