enum UserRoles {
  creators = "creators",
  backers = "backers",
  admin = "admin",
}

type userRoles = keyof typeof UserRoles;

enum BannerTypes {
  headerBanner = "headerBanner",
  backgroundBanner = "backgroundBanner",
}

type bannerTypes = keyof typeof BannerTypes;

enum Genders {
  MALE = "MALE",
  FEMALE = "FEMALE",
}

type gendersType = keyof typeof Genders;

enum UserStatus {
  confirmation = "confirmation",
  active = "active",
}

type userStatus = keyof typeof UserStatus;

interface IUserBase {
  id: string;
  username: string;
}

interface IDonatPageWithoutBanners {
  welcomeText: string;
  btnText: string;
  mainColor: string;
  backgroundColor: string;
}

interface IEditUserData extends IUserBase, IDonatPageWithoutBanners {}

interface IShortUserData extends IUserBase {
  roleplay: userRoles;
  walletAddress: string;
}

interface IDonatPage<T = string> extends IDonatPageWithoutBanners {
  [BannerTypes.headerBanner]: T;
  [BannerTypes.backgroundBanner]: T;
}

interface ICreatorInfo<T = string> extends IDonatPage<T> {
  spamFilter: boolean;
}

interface IUser<T = string> extends IShortUserData {
  email: string;
  status: userStatus;
  avatarLink: T;
  createdAt: Date;
  creator?: ICreatorInfo<T>;
}

interface IRegisterUser extends Pick<IUser, "username" | "email" | "roleplay"> {
  password: string;
}

interface ILoginUser extends Pick<IUser, "email"> {
  password: string;
}

interface IUserTokenPayload
  extends Pick<IUser, "id" | "email" | "status" | "username" | "roleplay"> {}

// interface IEditUserInfo<FileType = string> extends IUser<FileType> {
interface IEditCreator extends ICreatorInfo {
  isReset?: boolean;
}

type userDataKeys = keyof IUser;
type creatorDataKeys = keyof ICreatorInfo;

export { UserRoles, Genders, BannerTypes, UserStatus };

export type {
  userRoles,
  gendersType,
  bannerTypes,
  userStatus,
  IUserBase,
  IDonatPageWithoutBanners,
  IEditUserData,
  IShortUserData,
  IDonatPage,
  ICreatorInfo,
  IUser,
  IRegisterUser,
  ILoginUser,
  IEditCreator,
  IUserTokenPayload,
  userDataKeys,
  creatorDataKeys,
};
