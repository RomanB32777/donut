import { memo, useCallback, useMemo, useState } from "react";
import { Col, Radio, RadioChangeEvent, Row, Space } from "antd";
import clsx from "clsx";
import { FormattedMessage } from "react-intl";
import { ISendDonat, IUser } from "types";

import Loader from "components/Loader";
import { StarIcon } from "icons";
import { useGetGoalsQuery } from "store/services/GoalsService";

const Goals = ({
  personInfo,
  form,
  setForm,
}: {
  personInfo: IUser;
  form: ISendDonat;
  setForm: (value: React.SetStateAction<ISendDonat>) => void;
}) => {
  const { creator, id } = personInfo;

  const { data: goals, isLoading } = useGetGoalsQuery(id, { skip: !id });
  const [isOpenSelectGoal, setIsOpenSelectGoal] = useState<boolean>(true);

  const onChangeRadio = useCallback(
    (e: RadioChangeEvent) => {
      setForm((form) => ({
        ...form,
        goal: e.target.value,
      }));
    },
    [setForm]
  );

  const goalsActive = useMemo(
    () => (goals ? goals.filter((goal) => !goal.isArchive) : []),
    [goals]
  );

  const { goal } = form;

  if (isLoading) return <Loader size="small" />;

  if (!goalsActive.length) return null;

  return (
    <div className="goals">
      <Row justify="space-between">
        <Col md={9} xs={12}>
          <div
            className={clsx("btn", {
              active: isOpenSelectGoal,
            })}
            onClick={() => setIsOpenSelectGoal(!isOpenSelectGoal)}
            style={{
              background: creator?.mainColor,
            }}
          >
            <div className="header">
              <StarIcon />
              <p>
                <FormattedMessage id="donat_form_goal_title" />
              </p>
            </div>
            <p className="description">
              <FormattedMessage
                id="donat_form_goal_description"
                values={{ username: personInfo.username }}
              />
            </p>
          </div>
        </Col>
        {isOpenSelectGoal && (
          <Col md={14} xs={11}>
            <div className="list">
              <Radio.Group onChange={onChangeRadio} value={goal || "0"}>
                <Space direction="vertical">
                  <Radio className="radio-select" value="0">
                    <FormattedMessage id="donat_form_goal_dont_participate" />
                  </Radio>
                  {goalsActive.map(
                    ({ id, title, amountRaised, amountGoal }) => (
                      <Radio className="radio-select" key={id} value={id}>
                        {title} ({amountRaised}/{amountGoal}
                        &nbsp;USD)
                      </Radio>
                    )
                  )}
                </Space>
              </Radio.Group>
            </div>
          </Col>
        )}
      </Row>
    </div>
  );
};

export default memo(Goals);
