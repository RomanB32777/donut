import { memo } from "react";
import { Avatar, Col, Row, Tooltip } from "antd";
import { IShortUserData } from "types";

import Loader from "components/Loader";

const BadgeHolders = ({
  holders,
  isLoading,
}: {
  holders: IShortUserData[];
  isLoading: boolean;
}) => {
  if (isLoading) return <Loader size="big" />;
  return (
    <div className="holders">
      <Row justify="space-between" align="middle">
        <Col span={8}>
          <p className="title">Badge holders</p>
        </Col>
        <Col span={15}>
          <div className="users">
            <Avatar.Group
              maxCount={7}
              size="large"
              maxStyle={{
                color: "#FFFFFF",
                backgroundColor: "#E94560",
                cursor: "pointer",
                border: "none",
              }}
            >
              {holders.map((holder: any) => (
                <Tooltip
                  key={holder.username}
                  title={holder.username}
                  placement="top"
                >
                  {holder.avatar ? (
                    <Avatar src={holder.avatar} className="holder-avatar" />
                  ) : (
                    <Avatar
                      className="holder-avatar"
                      style={{ backgroundColor: "#E94560" }}
                    >
                      {holder.username[1]}
                    </Avatar>
                  )}
                </Tooltip>
              ))}
            </Avatar.Group>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default memo(BadgeHolders);
