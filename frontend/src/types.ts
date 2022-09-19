export interface IFileInfo {
    preview: string;
    file: File | null;
}

export interface IBadgeData {
  image: IFileInfo;
  name: string;
  description: string;
  blockchain: string;
}

export interface IGoalData {
  id: number;
  title: string;
  amount_goal: number;
  amount_raised: number;
  isArchive: boolean;
  title_color: string;
  progress_color: string;
  background_color: string;
  creator_id: string;
}

export interface IAlertData {
  banner: IFileInfo;
  message_color: string;
  name_color: string;
  sum_color: string;
  duration: number;
  sound: string;
  voice: boolean;
}