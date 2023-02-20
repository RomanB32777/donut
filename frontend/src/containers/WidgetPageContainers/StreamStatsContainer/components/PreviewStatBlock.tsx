import { FC, useMemo } from "react";
import { Col } from "antd";
import useWindowDimensions from "hooks/useWindowDimensions";
import {
  getCurrentTimePeriodQuery,
  getFontColorStyles,
  getStatsDataTypeQuery,
  renderStatItem,
} from "utils";
import { alignFlextItemsList, alignItemsList } from "consts";
import { AlignText, IWidgetStatData } from "appTypes";

interface IPreviewStatBlock {
  children?: React.ReactNode;
  editStatData: IWidgetStatData;
}

const PreviewStatBlock: FC<IPreviewStatBlock> = ({
  children,
  editStatData,
}) => {
  const { isLaptop } = useWindowDimensions();
  const {
    template,
    data_type,
    time_period,
    title_color,
    bar_color,
    content_color,
    aligment,
    title_font,
    content_font,
  } = editStatData;

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
          className="title"
          style={{
            ...getFontColorStyles(title_color, title_font),
            background: bar_color,
          }}
        >
          {typeStatData.toLowerCase()} {timePeriodName} 
        </span>
        <div
          className="stat"
          style={{
            justifyContent: alignFlextItemsList[aligment],
          }}
        >
          <div className="list">
            <p
              className="item"
              style={{
                ...getFontColorStyles(content_color, content_font),
                textAlign: (alignItemsList[aligment] as AlignText) || "center",
              }}
            >
              {renderStatItem(template, {
                username: "Jordan",
                sum_donation: 30,
                donation_message: "Hello! This is test message",
              })}
            </p>
            <p
              className="item"
              style={{
                ...getFontColorStyles(content_color, content_font),
                textAlign: (alignItemsList[aligment] as AlignText) || "center",
              }}
            >
              {renderStatItem(template, {
                username: "Nate",
                sum_donation: 50,
                donation_message: "How are you ?",
              })}
            </p>
          </div>
        </div>
      </div>
      {isLaptop && children}
    </Col>
  );
};

export default PreviewStatBlock;
