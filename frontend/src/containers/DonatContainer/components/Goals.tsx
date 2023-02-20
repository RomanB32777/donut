import { memo, useCallback, useMemo, useState } from "react";
import { Col, Radio, RadioChangeEvent, Row, Space } from "antd";
import clsx from "clsx";
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
  const { donat_page, id } = personInfo;

  const { data: goals, isLoading } = useGetGoalsQuery(id, { skip: !id });
  const [isOpenSelectGoal, setIsOpenSelectGoal] = useState<boolean>(true);

  const { main_color } = donat_page;

  const onChangeRadio = useCallback(
    (e: RadioChangeEvent) => {
      setForm((form) => ({
        ...form,
        selectedGoal: e.target.value,
      }));
    },
    [setForm]
  );

  const goalsActive = useMemo(
    () => (goals ? goals.filter((goal) => !goal.is_archive) : []),
    [goals]
  );

  const { selectedGoal } = form;

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
              background: main_color,
            }}
          >
            <div className="header">
              <StarIcon />
              <p>Donation goals</p>
            </div>
            <p className="description">
              Help {personInfo.username} achieve his donation goals
            </p>
          </div>
        </Col>
        {isOpenSelectGoal && (
          <Col md={14} xs={11}>
            <div className="list">
              <Radio.Group
                onChange={onChangeRadio}
                value={String(selectedGoal || "0")}
              >
                <Space direction="vertical">
                  <Radio className="radio-select" value="0">
                    Don't participate
                  </Radio>
                  {goalsActive.map(
                    ({ id, title, amount_raised, amount_goal }) => (
                      <Radio className="radio-select" key={id} value={id}>
                        {title} ({amount_raised}/{amount_goal}
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
