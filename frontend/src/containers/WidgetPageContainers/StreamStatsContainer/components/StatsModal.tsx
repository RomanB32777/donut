import { FC, memo, useCallback, useMemo } from "react";
import { Col, Row } from "antd";
import { FormattedMessage, useIntl } from "react-intl";
import { allPeriodItemsTypes, statsDataTypes } from "types";

import BaseButton from "components/BaseButton";
import FormInput from "components/FormInput";
import DatesPicker from "components/DatesPicker";
import ModalComponent from "components/ModalComponent";
import SelectInput, { ISelectItem } from "components/SelectInput";

import { useAppSelector } from "hooks/reduxHooks";
import useWindowDimensions from "hooks/useWindowDimensions";
import {
  useCreateStatMutation,
  useEditStatMutation,
} from "store/services/StatsService";
import {
  initWidgetStatData,
  filterCurrentPeriodItems,
  filterDataTypeItems,
} from "consts";
import { IWidgetStatData } from "appTypes";
import dayjsModule from "modules/dayjsModule";

const templates = ["{username}", "{sum}", "{message}"];

const templateList: ISelectItem[] = templates.map((tName) => ({
  value: tName,
  key: tName,
}));

interface IStatsModal {
  formData: IWidgetStatData;
  isOpenModal: boolean;
  setFormData: React.Dispatch<React.SetStateAction<IWidgetStatData>>;
  setIsOpenModal: (status: boolean) => void;
}

const StatsModal: FC<IStatsModal> = ({
  formData,
  isOpenModal,
  setFormData,
  setIsOpenModal,
}) => {
  const intl = useIntl();
  const { id: userID } = useAppSelector(({ user }) => user);
  const { isMobile } = useWindowDimensions();

  const [editStat, { isLoading: isEditLoading }] = useEditStatMutation();
  const [createStat, { isLoading: isCreateLoading }] = useCreateStatMutation();

  const {
    title,
    description,
    template,
    dataType,
    timePeriod,
    customTimePeriod,
  } = formData;

  const defaultCustomTimePeriod = useMemo(() => {
    if (customTimePeriod) {
      const dates = customTimePeriod.split("-");
      return dates.map((d) => dayjsModule(d, "DD/MM/YYYY"));
    }
    return [];
  }, [customTimePeriod]);

  const currTemplateList = useMemo(
    () =>
      dataType === "top-supporters"
        ? templateList.filter((t) => t.key !== "{message}")
        : templateList,
    [dataType]
  );

  const currTemplate = useMemo(
    () =>
      dataType === "top-supporters"
        ? (template as string[]).filter((t) => t !== "{message}")
        : template,
    [dataType, template]
  );

  const closeEditModal = useCallback(() => {
    setFormData(initWidgetStatData);
    setIsOpenModal(false);
  }, [setFormData, setIsOpenModal]);

  const sendData = async () => {
    try {
      const {
        id,
        title,
        description,
        template,
        dataType,
        timePeriod,
        customTimePeriod,
      } = formData;

      if (id) {
        await editStat({
          id,
          title,
          description,
          template: (template as string[]).join(" "),
          dataType,
          timePeriod,
          customTimePeriod,
        });
      } else {
        await createStat({
          title,
          description,
          template: (template as string[]).join(" "),
          dataType,
          timePeriod,
          creator: userID,
          customTimePeriod,
        });
      }

      setIsOpenModal(false);
      setFormData(initWidgetStatData);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <ModalComponent
      open={isOpenModal}
      title={<FormattedMessage id="stats_modal_title" />}
      onCancel={closeEditModal}
      width={880}
      topModal
    >
      <div className="stats-modal">
        <Row gutter={[0, 18]} className="form" justify="center">
          <Col span={24}>
            <div className="form-element">
              <FormInput
                label={<FormattedMessage id="stats_modal_form_title" />}
                name="widgetTitle"
                value={title}
                setValue={(value) => setFormData({ ...formData, title: value })}
                labelCol={6}
                inputCol={17}
                gutter={[0, 18]}
                rowProps={{ justify: "space-between" }}
              />
            </div>
          </Col>
          <Col span={24}>
            <div className="form-element">
              <FormInput
                label={<FormattedMessage id="stats_modal_form_description" />}
                name="description"
                value={description}
                setValue={(value) =>
                  setFormData({ ...formData, description: value })
                }
                labelCol={6}
                inputCol={17}
                gutter={[0, 18]}
                rowProps={{ justify: "space-between" }}
                isTextarea
              />
            </div>
          </Col>
          <Col span={24}>
            <div className="form-element">
              <SelectInput
                label={<FormattedMessage id="stats_modal_form_type" />}
                list={Object.keys(filterDataTypeItems).map((key) => ({
                  key,
                  value: filterDataTypeItems[key as statsDataTypes],
                }))}
                renderOption={(item) => intl.formatMessage({ id: item.value })}
                value={{
                  value: dataType,
                  label: intl.formatMessage({
                    id: filterDataTypeItems[dataType],
                  }),
                }}
                onChange={(value) =>
                  setFormData({
                    ...formData,
                    dataType: value as statsDataTypes,
                  })
                }
                labelCol={6}
                selectCol={17}
                gutter={[0, 18]}
                rowProps={{ justify: "space-between" }}
              />
            </div>
          </Col>
          <Col span={24}>
            <div className="form-element">
              <SelectInput
                label={<FormattedMessage id="stats_modal_form_time" />}
                list={Object.keys(filterCurrentPeriodItems).map((key) => ({
                  key,
                  value: filterCurrentPeriodItems[key as allPeriodItemsTypes],
                }))}
                renderOption={(item) => intl.formatMessage({ id: item.value })}
                value={{
                  value: timePeriod,
                  label: intl.formatMessage({
                    id: filterCurrentPeriodItems[timePeriod],
                  }),
                }}
                onChange={(value) =>
                  setFormData({
                    ...formData,
                    timePeriod: value,
                  })
                }
                labelCol={6}
                selectCol={17}
                gutter={[0, 18]}
                rowProps={{ justify: "space-between" }}
              />
              {timePeriod === "custom" && (
                <div className="customDatesPicker">
                  <Row>
                    <Col offset={isMobile ? 0 : 7}>
                      <DatesPicker
                        defaultValue={defaultCustomTimePeriod}
                        setValue={(startDate, endDate) =>
                          setFormData({
                            ...formData,
                            timePeriod: "custom",
                            customTimePeriod: `${startDate}-${endDate}`,
                          })
                        }
                      />
                    </Col>
                  </Row>
                </div>
              )}
            </div>
          </Col>
          <Col span={24}>
            <div className="form-element">
              <SelectInput
                label={<FormattedMessage id="stats_modal_form_template" />}
                list={currTemplateList}
                value={currTemplate}
                onChange={(value) =>
                  setFormData({
                    ...formData,
                    template: value as string[],
                  })
                }
                descriptionSelect={currTemplateList
                  .map((t) => t.value)
                  .join(", ")}
                offset={7}
                labelCol={6}
                selectCol={17}
                gutter={[0, 18]}
                rowProps={{ justify: "space-between" }}
                isTags
              />
            </div>
          </Col>
        </Row>
        <div className="btns">
          <div className="btns_cancel">
            <BaseButton
              formatId="form_cancel_button"
              padding="6px 35px"
              onClick={closeEditModal}
              fontSize="18px"
            />
          </div>
          <div className="btns_save">
            <BaseButton
              formatId="form_save_widget_button"
              padding="6px 35px"
              onClick={sendData}
              disabled={isEditLoading || isCreateLoading}
              fontSize="18px"
              isMain
            />
          </div>
        </div>
      </div>
    </ModalComponent>
  );
};

export default memo(StatsModal);
