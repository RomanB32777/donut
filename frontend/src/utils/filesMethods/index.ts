const setFormDataValues = <T extends object>({
  formData,
  dataValues,
}: {
  formData: FormData;
  dataValues: T;
}) => {
  for (const key in dataValues) {
    const fieldName = key as keyof T;
    const fieldValue = dataValues[fieldName];

    if (fieldValue instanceof File) {
      formData.append(String(fieldName), fieldValue);
    } else formData.append(String(fieldName), String(fieldValue));
  }

  return formData;
};

export { setFormDataValues };
