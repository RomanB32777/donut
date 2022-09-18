import { useEffect, useState } from "react";
import { FormattedMessage } from "react-intl";

import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import axiosClient, { baseURL } from "../../axiosClient";
import PageTitle from "../../commonComponents/PageTitle";
import ContentCard from "../../components/ContentCard";
import BaseButton from "../../commonComponents/BaseButton";
import { url } from "../../consts";
import { InfoIcon, LargeImageIcon } from "../../icons/icons";
import routes from "../../routes";
import "./styles.sass";

import testIMG from "../../assets/person.png";
import CreateBadgeForm from "./CreateBadgeForm";
import BadgePage from "./BadgePage";

const tableHeaderTitles = ["icon", "badge", "qnt", "info", "delete"];

const BadgesContainer = () => {
  const user = useSelector((state: any) => state.user);

  const [badgesList, setBadgesList] = useState<any[]>([
    {
      id: "1",
      badge_name: "test",
      badge_desc: "test",
      badge_image: testIMG,
      owner_user_id: "1",
      link: "google",
    },
  ]);
  const [showedPopupId, setShowedPopupId] = useState<number | null>(null);

  const [isOpenCreateForm, setIsOpenCreateForm] = useState<boolean>(false);
  const [isOpenBadgePage, setIsOpenBadgePage] = useState<boolean>(false);

  const getBadges = async (id: string) => {
    const res = await fetch(
      baseURL +
        `/api/badge/get-badges-by-${
          user.roleplay === "creators"
            ? "creator/" + user.id
            : "backer/" + user.id
        }`
    );
    if (res.status === 200) {
      const result = await res.json();
      // setBadgesList(result.badges);
    }
  };

  useEffect(() => {
    if (user.id) {
      getBadges(user.id);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const deleteBadge = async (id: number) => {
    const res = await axiosClient.post("/api/badge/delete-badge/", {
      badge_id: id,
    });
    res.status === 200 && user.id && getBadges(user.id);
  };

  useEffect(() => {
    const clickHandler = (event: any) => {
      if (
        event.target &&
        event.target.className &&
        (!event.target.className.includes("badge-panel") ||
          !event.target.className.includes("content-panel"))
      ) {
        setShowedPopupId(null);
      }
    };
    document.addEventListener("click", clickHandler);

    return () => {
      document.removeEventListener("click", clickHandler);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isOpenCreateForm)
    return <CreateBadgeForm backBtn={() => setIsOpenCreateForm(false)} />;

  if (isOpenBadgePage)
    return <BadgePage backBtn={() => setIsOpenBadgePage(false)} />;

  return (
    <div className="badges-container">
      <PageTitle formatId="page_title_badges" />

      {user && user.id && user.roleplay && user.roleplay === "creators" && (
        <div className="badges-container__new-badge-wrapper">
          <span>
            <FormattedMessage id="badges_page_new_title" />
          </span>
          <BaseButton
            formatId="badges_page_new_button"
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
          badgesList.map(
            (
              { id, badge_name, badge_desc, badge_image, owner_user_id, link },
              rowIndex
            ) => (
              <div
                key={"badge-panel" + rowIndex}
                className="badge-panel"
                style={{
                  marginRight:
                    rowIndex % 4 !== 3 ? (1170 - 220 * 4) / 3 + "px" : "0px",
                  position: "relative",
                }}
                onClick={() => {
                  setIsOpenBadgePage(true);
                }}
              >
                <ContentCard
                  data={{
                    name: badge_name,
                    image: badge_image,
                    creator_id: owner_user_id,
                  }}
                  onClick={() => deleteBadge(id)}
                />

                {showedPopupId === rowIndex ? (
                  <div
                    className="badges-container__table__main__row__popup"
                    style={{
                      [(rowIndex + 1) % 4 === 0 ? "right" : "left"]: "230px",
                    }}
                  >
                    {/* <div className="row-popup__image">
                      {badge_image ? (
                        <img
                          src={
                            testIMG
                            // url + badge_image
                          }
                          alt={badge_name}
                        />
                      ) : (
                        <LargeImageIcon />
                      )}
                    </div> */}
                    <div className="row-popup__text">
                      <div className="title">{badge_name}</div>
                      <div className="desc">{badge_desc}</div>
                      {link && (
                        <a className="link" href={link}>
                          {link}
                        </a>
                      )}
                    </div>
                  </div>
                ) : (
                  <></>
                )}
              </div>
            )
          )}
      </div>
    </div>
  );
};

export default BadgesContainer;
