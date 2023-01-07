import { useMemo } from "react";
import { Col } from "antd";
import { IStatData } from "types";
import BaseButton from "components/BaseButton";
import useWindowDimensions from "hooks/useWindowDimensions";
import { getCurrentTimePeriodQuery, getStatsDataTypeQuery, renderStatItem } from "utils";
import { alignFlextItemsList, alignItemsList } from "consts";
import { AlignText, IEditStatData } from "appTypes";

const PreviewStatBlock = ({
  editStatData,
  statData,
  loading,
  sendColorsData,
}: {
  editStatData: IEditStatData;
  statData: IStatData;
  loading: boolean;
  sendColorsData: () => Promise<void>;
}) => {
  const { isLaptop } = useWindowDimensions();
  const { template, data_type, time_period } = statData;
  const { title_color, bar_color, content_color, aligment } = editStatData;

  const timePeriodName = useMemo(
    () => getCurrentTimePeriodQuery(time_period),
    [time_period]
  );

  const typeStatData = useMemo(
    () => getStatsDataTypeQuery(data_type),
    [data_type]
  );

  return (
    <Col
      xl={10}
      md={24}
      style={{
        width: "100%",
      }}
    >
      <div className="preview-block">
        <span
          className="preview-block_title"
          style={{
            background: bar_color,
            color: title_color,
          }}
        >
          {timePeriodName} {typeStatData.toLowerCase()}
        </span>
        <div
          className="preview-block_stat"
          style={{
            justifyContent: alignFlextItemsList[aligment],
          }}
        >
          <div className="preview-block_stat__list">
            <p
              className="preview-block_stat__list-item"
              style={{
                color: content_color,
                textAlign: (alignItemsList[aligment] as AlignText) || "center",
              }}
            >
              {renderStatItem(
                template,
                {
                  username: "Jordan",
                  sum_donation: 30,
                  donation_message: "Hello! This is test message",
                },
                2.7
              )}
            </p>
            <p
              className="preview-block_stat__list-item"
              style={{
                color: content_color,
                textAlign: (alignItemsList[aligment] as AlignText) || "center",
              }}
            >
              {renderStatItem(
                template,
                {
                  username: "Nate",
                  sum_donation: 50,
                  donation_message: "How are you ?",
                },
                2.7
              )}
            </p>
          </div>
        </div>
      </div>
      {isLaptop && (
        <div className="btn-block">
          <BaseButton
            formatId="profile_form_save_changes_button"
            padding="6px 35px"
            onClick={sendColorsData}
            fontSize="18px"
            disabled={loading}
            isMain
          />
        </div>
      )}
    </Col>
  );
};

export default PreviewStatBlock;
