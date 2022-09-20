import { useEffect, useState } from "react";
import { FormattedMessage } from "react-intl";

import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import axiosClient, { baseURL } from "../../axiosClient";
import PageTitle from "../../commonComponents/PageTitle";
import ContentCard from "./ContentCard";
import BaseButton from "../../commonComponents/BaseButton";
import { url } from "../../consts";
import { InfoIcon, LargeImageIcon } from "../../icons/icons";
import routes from "../../routes";
import "./styles.sass";

import testIMG from "../../assets/person.png";
import CreateBadgeForm from "./CreateBadgeForm";
import BadgePage from "./BadgePage";
import { IBadge } from "../../types";

const BadgesContainer = () => {
  const user = useSelector((state: any) => state.user);

  const [badgesList, setBadgesList] = useState<IBadge[]>([]);
  const [activeBadge, setActiveBadge] = useState<IBadge>({
    id: 0,
    contract_address: "",
  });
  const [isOpenCreateForm, setIsOpenCreateForm] = useState<boolean>(false);
  const [isOpenBadgePage, setIsOpenBadgePage] = useState<boolean>(false);

  const getBadges = async (id: number) => {
    const { data } = await axiosClient.get(`${baseURL}/api/badge/${id}`);
    if (Array.isArray(data) && data.length) {
      setBadgesList(data);
    }
  };

  useEffect(() => {
    if (user.id) {
      getBadges(user.id);
    }
  }, [user]);

  const deleteBadge = async (id: number) => {
    const res = await axiosClient.delete(`/api/badge/${id}`);
    res.status === 200 && user.id && getBadges(user.id);
  };

  if (isOpenCreateForm)
    return <CreateBadgeForm backBtn={() => setIsOpenCreateForm(false)} />;

  if (isOpenBadgePage)
    return (
      <BadgePage
        activeBadge={activeBadge}
        backBtn={() => setIsOpenBadgePage(false)}
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
          badgesList.map(({ id, contract_address }, rowIndex) => (
            <div
              key={"badge-panel" + rowIndex}
              className="badge-panel"
              style={{
                marginRight:
                  rowIndex % 4 !== 3 ? (1170 - 220 * 4) / 3 + "px" : "0px",
                position: "relative",
              }}
              onClick={() => {
                setActiveBadge({ id, contract_address });
                setIsOpenBadgePage(true);
              }}
            >
              <ContentCard
                data={{
                  id,
                  contract_address
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
