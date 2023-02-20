import { IDataWithFile } from "appTypes";

const setFormDataValues = <T extends object>({
  formData,
  dataValues,
}: {
  formData: FormData;
  dataValues: IDataWithFile<T>;
}) => {
  const { data, file, ...params } = dataValues;
  const paramsObj = params as Record<string, string>;

  if (data) {
    for (const key in data) formData.append(key, String(data[key]));
  }

  for (const key in paramsObj)
    paramsObj[key] && formData.append(key, String(paramsObj[key]));

  if (file) formData.append("file", file);
  // formData.append("fileName", file.name);

  return formData;
};

export { setFormDataValues };
