import axiosClient from "modules/axiosClient";

export const checkIsExistUser = async (addressOrUsername: string) => {
  const { data } = await axiosClient.get(
    `/api/user/check-user-exist/${addressOrUsername}`
  );

  if (data.notExist) return false;
  return true;
};
