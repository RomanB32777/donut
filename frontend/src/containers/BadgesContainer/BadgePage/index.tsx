import { memo, useCallback, useContext, useEffect, useState } from "react";
import { Col, Row } from "antd";
import { IBadgeInfo, ISocketEmitObj, IShortUserData } from "types";

import { WebSocketContext } from "contexts/Websocket";
import PageTitle from "components/PageTitle";
import BadgeDetails from "./components/BadgeDetails";
import BadgeHolders from "./components/BadgeHolders";
import BadgeAssignBlock from "./components/BadgeAssignBlock";
import { LeftArrowIcon } from "icons";

import { useAppSelector } from "hooks/reduxHooks";
import {
  useGetBadgeQuery,
  useGetHoldersQuery,
} from "store/services/BadgesService";
import "./styles.sass";

const BadgePage = ({
  activeBadge,
  backBtn,
}: {
  activeBadge: IBadgeInfo;
  backBtn: (updateList?: boolean) => () => void;
}) => {
  const socket = useContext(WebSocketContext);
  const user = useAppSelector(({ user }) => user);

  const [badgeInfo, setBadgeInfo] = useState<IBadgeInfo>(activeBadge);
  const [updateList, setUpdateList] = useState(false);

  const { id: userID, wallet_address } = user;
  const { id, image, title, is_creator, token_id } = badgeInfo;

  const { data: badgeData, isLoading: isBadgeInfoLoading } = useGetBadgeQuery(
    { id, wallet_address },
    { skip: !userID && !wallet_address }
  );

  const {
    data: holders,
    isLoading: isHoldersLoading,
    refetch: getHolders,
  } = useGetHoldersQuery(id, {
    skip: !is_creator,
  });

  const sendAssignedBadge = useCallback(
    async (selectedUser: IShortUserData) => {
      if (socket) {
        const { id: userID, username } = user;

        const sendData: ISocketEmitObj = {
          supporter: {
            username: selectedUser.username,
            id: selectedUser.id,
          },
          creator: {
            id: userID,
            username,
          },
          id,
        };
        socket.emit("new_badge", sendData);
      }
      getHolders();
    },
    [id, socket, user, getHolders]
  );

  useEffect(() => {
    !token_id && setUpdateList(true);
  }, [token_id]);

  useEffect(() => {
    badgeData && setBadgeInfo((prev) => ({ ...prev, ...badgeData }));
  }, [badgeData]);

  return (
    <div className="badge-page fadeIn">
      <div className="title badges-title">
        <div className="icon" onClick={backBtn(updateList)}>
          <LeftArrowIcon />
        </div>
        <PageTitle title={title} notMarginBottom />
      </div>

      <Row gutter={[4, 16]} className="form" justify="space-between">
        <Col lg={10} md={8} xs={18}>
          <p className="image-title">Badge Image</p>
          <div className="image-block">
            <div className="content">
              <img src={image} alt={title} />
            </div>
          </div>
        </Col>
        <Col lg={13} md={15} xs={24}>
          <BadgeDetails badgeInfo={badgeInfo} isLoading={isBadgeInfoLoading} />
          {is_creator && (
            <Row gutter={[0, 24]}>
              {holders && Boolean(holders.length) && (
                <Col span={24}>
                  <BadgeHolders
                    holders={holders}
                    isLoading={isHoldersLoading}
                  />
                </Col>
              )}

              <Col span={24}>
                <BadgeAssignBlock
                  badgeInfo={activeBadge}
                  sendAssignedBadge={sendAssignedBadge}
                />
              </Col>
            </Row>
          )}
        </Col>
      </Row>
    </div>
  );
};

export default memo(BadgePage);
