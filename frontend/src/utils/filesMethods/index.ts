import { defaultAssetsFolders, ISoundInfo } from "types";
import axiosClient from "modules/axiosClient";

const sendFile = async ({
  file,
  username,
  url,
  userId,
  filelink,
  isEdit = true,
  data,
}: {
  file: File | null;
  username: string;
  url: string;
  data?: {
    key: string;
    body: string;
  };
  filelink?: string;
  userId?: number;
  isEdit?: boolean;
}) => {
  const formData = new FormData();
  formData.append("username", username);

  if (file) {
    formData.append("file", file);
    formData.append("fileName", file.name);
  }

  data && formData.append(data.key, data.body);
  userId && formData.append("userId", String(userId));
  filelink && formData.append("filelink", filelink);

  const res = await axiosClient[isEdit ? "put" : "post"](url, formData);
  return res.status === 200 ? res : null;
};

const getDefaultImages = async (
  type: defaultAssetsFolders
): Promise<string[]> => {
  const { status, data } = await axiosClient.get(
    `/api/file/default-images/${type}`
  );
  return status === 200 ? data : [];
};

const getSounds = async (username: string): Promise<ISoundInfo[]> => {
  const { status, data } = await axiosClient.get(`/api/file/sounds/${username}`);
  return status === 200 ? data : [];
};

export { sendFile, getDefaultImages, getSounds };
