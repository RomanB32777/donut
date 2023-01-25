import { Col, Row } from "antd";
import { useContext, useEffect, useState } from "react";
import { IBadgeInfo, IMintBadgeSocketObj, IShortUserData } from "types";

import { WebSocketContext } from "components/Websocket";
import PageTitle from "components/PageTitle";
import BadgeDetails from "./components/BadgeDetails";
import BadgeHolders from "./components/BadgeHolders";
import BadgeAssignBlock from "./components/BadgeAssignBlock";
import { LeftArrowIcon } from "icons";

import axiosClient from "modules/axiosClient";
import { useAppSelector } from "hooks/reduxHooks";
import "./styles.sass";

const BadgePage = ({
  activeBadge,
  backBtn,
}: {
  activeBadge: IBadgeInfo;
  backBtn: (updateList?: boolean) => () => void;
  deleteBadge: (badge: IBadgeInfo) => Promise<void>;
}) => {
  const socket = useContext(WebSocketContext);
  const { id, username, wallet_address } = useAppSelector(({ user }) => user);

  const [badgeInfo, setBadgeInfo] = useState<IBadgeInfo>(activeBadge);
  const [supporters, setSupporters] = useState<IShortUserData[]>([]);
  const [holders, setHolders] = useState<IShortUserData[]>([]);
  const [updateList, setUpdateList] = useState(false);

  const { image, title, is_creator, token_id } = badgeInfo;

  const updateBadgeData = async () => {
    try {
      const { id } = activeBadge;
      const { data, status } = await axiosClient.get(
        `/api/badge/${id}/${wallet_address}`
      );
      !token_id && setUpdateList(true);
      status === 200 && setBadgeInfo((prev) => ({ ...prev, ...data }));
    } catch (error) {
      console.log(error);
    }
  };

  const getHolders = async () => {
    try {
      const { id } = activeBadge;
      const { data, status } = await axiosClient.get(
        `/api/badge/holders/${id}`
      );
      status === 200 && setHolders(data);
    } catch (error) {
      console.log(error);
    }
  };

  const getSupporters = async () => {
    try {
      const { data, status } = await axiosClient.get(
        `/api/donation/supporters/${id}`
      );
      status === 200 && setSupporters(data);
    } catch (error) {
      console.log(error);
    }
  };

  const sendAssignedBadge = async (selectedUser: IShortUserData) => {
    if (socket) {
      const sendData: IMintBadgeSocketObj = {
        supporter: {
          username: selectedUser.username,
          id: selectedUser.id,
        },
        creator: {
          id,
          username,
        },
        badge: {
          id,
          name: title,
        },
      };
      socket.emit("new_badge", sendData);
    }
    await updateBadgeData();
    await getHolders();
  };

  useEffect(() => {
    const initPage = async () => {
      if (is_creator) {
        await getHolders();
        await getSupporters();
      }
    };

    initPage();
  }, [is_creator]);

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
          <BadgeDetails
            badgeInfo={badgeInfo}
            updateBadgeData={updateBadgeData}
          />
          {is_creator && (
            <Row gutter={[0, 24]}>
              {Boolean(holders.length) && (
                <Col span={24}>
                  <BadgeHolders holders={holders} getHolders={getHolders} />
                </Col>
              )}
              <Col span={24}>
                <BadgeAssignBlock
                  badgeInfo={activeBadge}
                  supporters={supporters}
                  getSupporters={getSupporters}
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

export default BadgePage;
