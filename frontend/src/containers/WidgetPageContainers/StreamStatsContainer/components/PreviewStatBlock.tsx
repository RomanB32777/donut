import { FC } from "react";
import { Col } from "antd";
import { useIntl } from "react-intl";

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
  const intl = useIntl();
  const { isLaptop } = useWindowDimensions();
  const {
    template,
    dataType,
    timePeriod,
    titleColor,
    barColor,
    contentColor,
    textAligment,
    titleFont,
    contentFont,
    customTimePeriod,
  } = editStatData;

  const timePeriodName =
    customTimePeriod ??
    intl.formatMessage({
      id: getCurrentTimePeriodQuery(timePeriod),
    });

  const typeStatData = intl.formatMessage({
    id: getStatsDataTypeQuery(dataType),
  });

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
            ...getFontColorStyles(titleColor, titleFont),
            background: barColor,
          }}
        >
          {typeStatData} {timePeriodName.toLowerCase()}
        </span>
        <div
          className="stat"
          style={{
            justifyContent: alignFlextItemsList[textAligment],
          }}
        >
          <div className="list">
            <p
              className="item"
              style={{
                ...getFontColorStyles(contentColor, contentFont),
                textAlign:
                  (alignItemsList[textAligment] as AlignText) || "center",
              }}
            >
              {renderStatItem(template, {
                username: "Jordan",
                sum: 30,
                message: intl.formatMessage({
                  id: "stats_widget_preview_message",
                }),
              })}
            </p>
            <p
              className="item"
              style={{
                ...getFontColorStyles(contentColor, contentFont),
                textAlign:
                  (alignItemsList[textAligment] as AlignText) || "center",
              }}
            >
              {renderStatItem(template, {
                username: "Nate",
                sum: 50,
                message: intl.formatMessage({
                  id: "stats_widget_preview_message_2",
                }),
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
