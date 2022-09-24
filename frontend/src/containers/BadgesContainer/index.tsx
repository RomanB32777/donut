import { useEffect, useState } from "react";
import { FormattedMessage } from "react-intl";

import { useSelector } from "react-redux";
import axiosClient, { baseURL } from "../../axiosClient";
import PageTitle from "../../commonComponents/PageTitle";
import ContentCard from "./ContentCard";
import BaseButton from "../../commonComponents/BaseButton";
import "./styles.sass";

import CreateBadgeForm from "./CreateBadgeForm";
import BadgePage from "./BadgePage";
import { IBadge, IBadgeData, initBadgeData } from "../../types";
import { addNotification } from "../../utils";
import { Empty } from "antd";

const BadgesContainer = () => {
  const user = useSelector((state: any) => state.user);

  const [badgesList, setBadgesList] = useState<IBadgeData[]>([]);
  const [activeBadge, setActiveBadge] = useState<IBadgeData>({
    ...initBadgeData,
  });
  const [isOpenCreateForm, setIsOpenCreateForm] = useState<boolean>(false);
  const [isOpenBadgePage, setIsOpenBadgePage] = useState<boolean>(false);

  const getBadges = async (id: number) => {
    const url =
      user.roleplay === "creators"
        ? `${baseURL}/api/badge/${id}`
        : `${baseURL}/api/badge/badges-backer/${id}`;

    const { data } = await axiosClient.get(url);
    if (Array.isArray(data) && data.length) {
      setBadgesList(data);
    }
  };

  const deleteBadge = async (badge: IBadgeData) => {
    try {
      const { id, contract_address, title, quantity } = badge;
      if (title && quantity < 1) {
        const res = await axiosClient.delete(
          `/api/badge/${id}/${contract_address}`
        );
        if (res.status === 200 && user.id) {
          await getBadges(user.id);
          return true;
        }
      } else if (title && quantity > 0) {
        addNotification({
          type: "warning",
          title: "Badge removal is not possible",
          message: "Badge removal is not possible (contributor users > 0)",
        });
        return false;
      } else {
        addNotification({
          type: "warning",
          title: "Badge removal is not possible",
          message: `Deleting a badge is not possible until its content is loaded`,
        });
        return false;
      }
    } catch (error) {
      addNotification({
        type: "danger",
        title: "Error",
        message:
          (error as any)?.response?.data?.message ||
          `An error occurred while deleting data`,
      });
      return false;
    }
  };

  useEffect(() => {
    if (user.id && user.roleplay && !isOpenCreateForm) {
      getBadges(user.id);
    }
  }, [user, isOpenCreateForm]);

  if (isOpenBadgePage)
    return (
      <BadgePage
        activeBadge={activeBadge}
        deleteBadge={deleteBadge}
        backBtn={() => setIsOpenBadgePage(false)}
      />
    );

  if (isOpenCreateForm)
    return (
      <CreateBadgeForm
        backBtn={() => setIsOpenCreateForm(false)}
        setActiveBadge={(activeBadge: IBadgeData) =>
          setActiveBadge(activeBadge)
        }
        openBadgePage={() => setIsOpenBadgePage(true)}
      />
    );

  return (
    <div className="badges-container">
      <PageTitle formatId="page_title_badges" />

      {user && user.id && user.roleplay && user.roleplay === "creators" && (
        <div className="badges-container__new-badge-wrapper">
          <span>
            <FormattedMessage id="badges_page_new_title" />
          </span>
          <BaseButton
            formatId="create_badge_form_button"
            padding="6px 43px"
            fontSize="18px"
            onClick={() => setIsOpenCreateForm(true)}
            isBlue
          />
        </div>
      )}

      <div className="badges-container__list">
        {badgesList && badgesList.length > 0 ? (
          badgesList.map(({ id, contract_address, creator_id }, rowIndex) => (
            <div
              key={"badge-panel" + rowIndex}
              className="badge-panel"
              style={{
                marginRight:
                  rowIndex % 4 !== 3 ? (1170 - 220 * 4) / 3 + "px" : "0px",
                position: "relative",
              }}
            >
              <ContentCard
                data={{
                  id,
                  creator_id,
                  contract_address,
                }}
                onClick={(badgeData) => {
                  setActiveBadge({ ...badgeData });
                  setIsOpenBadgePage(true);
                }}
                deleteBadge={deleteBadge}
              />
            </div>
          ))
        ) : (
          <Empty className="empty-el" image={Empty.PRESENTED_IMAGE_SIMPLE} />
        )}
      </div>
    </div>
  );
};

export default BadgesContainer;
