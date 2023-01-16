import { useMemo, useState } from "react";
import { Col, Radio, RadioChangeEvent, Row, Space } from "antd";
import clsx from "clsx";
import { ISendDonat } from "types";

import { useAppSelector } from "hooks/reduxHooks";
import { StarIcon } from "icons";

const Goals = ({
  form,
  setForm,
}: {
  form: ISendDonat;
  setForm: (value: React.SetStateAction<ISendDonat>) => void;
}) => {
  const { goals, personInfo } = useAppSelector((state) => state);
  const [isOpenSelectGoal, setIsOpenSelectGoal] = useState<boolean>(true);

  const { donat_page } = personInfo;
  const { main_color } = donat_page;

  const onChangeRadio = (e: RadioChangeEvent) => {
    setForm((form) => ({
      ...form,
      selectedGoal: e.target.value,
    }));
  };

  const goalsActive = useMemo(
    () => goals.filter((goal) => !goal.is_archive),
    [goals]
  );

  const { selectedGoal } = form;

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
              Help adinross achieve his donation goals
            </p>
          </div>
        </Col>
        {isOpenSelectGoal && (
          <Col md={14} xs={11}>
            <div className="list">
              <Radio.Group
                onChange={onChangeRadio}
                value={String(selectedGoal)}
              >
                <Space direction="vertical">
                  <Radio className="radio-select" value="0">
                    Don't participate
                  </Radio>
                  {goalsActive &&
                    goalsActive.map(
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

export default Goals;
