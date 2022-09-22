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
import { IBadge } from "../../types";

const BadgesContainer = () => {
  const user = useSelector((state: any) => state.user);

  const [badgesList, setBadgesList] = useState<IBadge[]>([]);
  const [activeBadge, setActiveBadge] = useState<IBadge>({
    id: 0,
    creator_id: 0,
    contract_address: "",
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

  useEffect(() => {
    if (user.id && user.roleplay) {
      getBadges(user.id);
    }
  }, [user]);

  const deleteBadge = async (id: number) => {
    const res = await axiosClient.delete(`/api/badge/${id}`);
    res.status === 200 && user.id && getBadges(user.id);
  };

  if (isOpenBadgePage)
  return (
    <BadgePage
      activeBadge={activeBadge}
      backBtn={() => setIsOpenBadgePage(false)}
    />
  );

  if (isOpenCreateForm)
    return (
      <CreateBadgeForm
        backBtn={() => setIsOpenCreateForm(false)}
        setActiveBadge={(activeBadge: IBadge) => setActiveBadge(activeBadge)}
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
        {badgesList &&
          badgesList.length > 0 &&
          badgesList.map(({ id, contract_address, creator_id }, rowIndex) => (
            <div
              key={"badge-panel" + rowIndex}
              className="badge-panel"
              style={{
                marginRight:
                  rowIndex % 4 !== 3 ? (1170 - 220 * 4) / 3 + "px" : "0px",
                position: "relative",
              }}
              onClick={() => {
                setActiveBadge({ id, creator_id, contract_address });
                setIsOpenBadgePage(true);
              }}
            >
              <ContentCard
                data={{
                  id,
                  creator_id,
                  contract_address,
                }}
                onClick={() => deleteBadge(id)}
              />
            </div>
          ))}
      </div>
    </div>
  );
};

export default BadgesContainer;
