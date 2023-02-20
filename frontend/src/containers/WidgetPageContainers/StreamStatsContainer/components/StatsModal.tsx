import { FC, memo, useCallback, useMemo } from "react";
import { Col, Row } from "antd";
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
import { IWidgetStatData, keyPeriodItems } from "appTypes";

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
  const { id: userID } = useAppSelector(({ user }) => user);
  const { isMobile } = useWindowDimensions();

  const [editStat, { isLoading: isEditLoading }] = useEditStatMutation();
  const [createStat, { isLoading: isCreateLoading }] = useCreateStatMutation();

  const {
    title,
    stat_description,
    template,
    data_type,
    time_period,
    custom_period,
  } = formData;

  const currTemplateList = useMemo(
    () =>
      data_type === filterDataTypeItems["top-supporters"]
        ? templateList.filter((t) => t.key !== "{message}")
        : templateList,
    [data_type]
  );

  const currTemplate = useMemo(
    () =>
      data_type === filterDataTypeItems["top-supporters"]
        ? (template as string[]).filter((t) => t !== "{message}")
        : template,
    [data_type, template]
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
        stat_description,
        template,
        data_type,
        time_period,
        custom_period,
      } = formData;

      const timePeriod = time_period === "custom" ? custom_period : time_period;
      id
        ? await editStat({
            statData: {
              title,
              stat_description,
              template: (template as string[]).join(" "),
              data_type,
              time_period: timePeriod as any,
              creator_id: userID,
            },
            id,
          })
        : await createStat({
            title,
            stat_description,
            template: (template as string[]).join(" "),
            data_type,
            time_period: timePeriod as any,
            creator_id: userID,
          });

      setIsOpenModal(false);
      setFormData(initWidgetStatData);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <ModalComponent
      open={isOpenModal}
      title="New widget creation"
      onCancel={closeEditModal}
      width={880}
      topModal
    >
      <div className="stats-modal">
        <Row gutter={[0, 18]} className="form" justify="center">
          <Col span={24}>
            <div className="form-element">
              <FormInput
                label="Widget title:"
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
                label="Widget description:"
                name="stat_description"
                value={stat_description}
                setValue={(value) =>
                  setFormData({ ...formData, stat_description: value })
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
                label="Data type:"
                list={Object.keys(filterDataTypeItems).map((key) => ({
                  key,
                  value: filterDataTypeItems[key as statsDataTypes],
                }))}
                value={data_type}
                onChange={(value) =>
                  setFormData({
                    ...formData,
                    data_type: value as statsDataTypes,
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
                label="Time period:"
                list={Object.keys(filterCurrentPeriodItems).map((key) => ({
                  key,
                  value: filterCurrentPeriodItems[key as allPeriodItemsTypes],
                }))}
                value={time_period}
                onChange={(value) =>
                  setFormData({
                    ...formData,
                    time_period: value as keyPeriodItems,
                  })
                }
                labelCol={6}
                selectCol={17}
                gutter={[0, 18]}
                rowProps={{ justify: "space-between" }}
              />
              {time_period === "custom" && (
                <div className="customDatesPicker">
                  <Row>
                    <Col offset={isMobile ? 0 : 7}>
                      <DatesPicker
                        defaultValue={
                          Array.isArray(custom_period) ? custom_period : []
                        }
                        setValue={(startDate, endDate) =>
                          setFormData({
                            ...formData,
                            time_period: "custom",
                            custom_period: `${startDate}-${endDate}`,
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
                label="Template:"
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
              formatId="profile_form_cancel_button"
              padding="6px 35px"
              onClick={closeEditModal}
              fontSize="18px"
            />
          </div>
          <div className="btns_save">
            <BaseButton
              formatId="profile_form_save_widget_button"
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
