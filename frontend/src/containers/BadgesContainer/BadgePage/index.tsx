import { memo, useCallback, useContext, useEffect, useState } from "react";
import { Col, Row } from "antd";
import { FormattedMessage } from "react-intl";
import { ISocketEmitObj, IShortUserData } from "types";

import { WebSocketContext } from "contexts/Websocket";
import PageTitle from "components/PageTitle";
import BadgeDetails from "./components/BadgeDetails";
import BadgeHolders from "./components/BadgeHolders";
import BadgeAssignBlock from "./components/BadgeAssignBlock";
import { LeftArrowIcon } from "icons";

import {
  useGetBadgeQuery,
  useGetHoldersQuery,
} from "store/services/BadgesService";
import { IBadgePage } from "appTypes";
import "./styles.sass";

const initState: IBadgePage = {
  image: "",
  id: "",
  title: "",
  description: "",
  blockchain: "Polygon",
  creator: "",
};

const BadgePage = ({
  badgeId,
  backBtn,
}: {
  badgeId: string;
  backBtn: (updateList?: boolean) => () => void;
}) => {
  const socket = useContext(WebSocketContext);
  // const user = useAppSelector(({ user }) => user);

  const [badgeInfo, setBadgeInfo] = useState<IBadgePage>({
    ...initState,
    id: badgeId,
  });
  const [updateList, setUpdateList] = useState(false);

  const { id, image, title, isCreator, tokenId } = badgeInfo;

  const { data: badgeData, isLoading: isBadgeInfoLoading } =
    useGetBadgeQuery(id);

  const {
    data: holders,
    isLoading: isHoldersLoading,
    refetch: getHolders,
  } = useGetHoldersQuery(id, {
    skip: !isCreator,
  });

  const sendAssignedBadge = useCallback(
    async (selectedUser: IShortUserData) => {
      if (socket) {
        const sendData: ISocketEmitObj = {
          id,
          toSendUsername: selectedUser.username,
        };
        socket.emit("newBadge", sendData);
      }
      getHolders();
    },
    [id, socket, getHolders]
  );

  useEffect(() => {
    !tokenId && setUpdateList(true);
  }, [tokenId]);

  useEffect(() => {
    if (badgeData) {
      setBadgeInfo((prev) => ({
        ...prev,
        ...badgeData,
      }));
    }
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
          <p className="image-title">
            <FormattedMessage id="badge_image" />
          </p>
          <div className="image-block">
            <div className="content">
              <img src={image} alt={title} />
            </div>
          </div>
        </Col>
        <Col lg={13} md={15} xs={24}>
          <BadgeDetails badgeInfo={badgeInfo} isLoading={isBadgeInfoLoading} />
          {isCreator && (
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
                  badgeInfo={badgeInfo}
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
