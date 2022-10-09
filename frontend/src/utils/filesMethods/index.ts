import axiosClient from "../../axiosClient";

export const sendFile = async (file: File, user: any, url: string) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("fileName", file.name);
  if (user && user.id) {
    const res = await axiosClient.post(url + user.id, formData);
    if (res.status === 200) {
      return res;
    }
  }
};
