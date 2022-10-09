import postData from "../../functions/postData";

export const checkIsExistUser = async (token: string) => {
  const data = await postData("/api/user/check-user-exist/", { token });
  if (data.notExist) return false;
  return true;
};
