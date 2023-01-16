import axiosClient from "modules/axiosClient";

export const checkIsExistUser = async (address: string) => {
  const { data } = await axiosClient.get(
    `/api/user/check-user-exist/${address}`
  );

  if (data.notExist) return false;
  return true;
};
