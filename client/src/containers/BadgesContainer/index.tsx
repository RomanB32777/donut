import { useEffect, useState } from "react";
import { FormattedMessage } from "react-intl";

import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import axiosClient, { baseURL } from "../../axiosClient";
import BlueButton from "../../commonComponents/BlueButton";
import PageTitle from "../../commonComponents/PageTitle";
import ContentCard from "../../components/ContentCard";
import { url } from "../../consts";
import { InfoIcon, LargeImageIcon } from "../../icons/icons";
import routes from "../../routes";
import "./styles.sass";

import testIMG from "../../assets/person.png";

const tableHeaderTitles = ["icon", "badge", "qnt", "info", "delete"];

const BadgesContainer = () => {
  const navigate = useNavigate();

  const user = useSelector((state: any) => state.user);

  const [badgesList, setBadgesList] = useState<any[]>([]);
  const [showedPopupId, setShowedPopupId] = useState<number | null>(null);

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
      setBadgesList(result.badges);
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
        console.log("LOL");
        setShowedPopupId(null);
      }
    };
    document.addEventListener("click", clickHandler);

    return () => {
      document.removeEventListener("click", clickHandler);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="badges-container">
      <PageTitle formatId="page_title_badges" />

      {user && user.id && user.roleplay && user.roleplay === "creators" && (
        <div className="badges-container__new-badge-wrapper">
          <span>
            <FormattedMessage id="badges_page_new_title" />
          </span>
          <BlueButton
            formatId="badges_page_new_button"
            padding="6px 43px"
            fontSize="18px"
            onClick={() => navigate(routes.createNewBadge)}
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
                  showedPopupId === rowIndex
                    ? setShowedPopupId(null)
                    : setShowedPopupId(rowIndex);
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

      {/* <div className="badges-container__table">
        <div className="badges-container__table__header">
          {tableHeaderTitles.map((title) => {
            if (title === "delete" && user.roleplay === "backers") return null;
            return (
              <div key={"badges_page_table_header_" + title}>
                <FormattedMessage id={"badges_page_table_header_" + title} />
              </div>
            );
          })}
        </div>

        <div className="badges-container__table__main">
          {badgesList &&
            badgesList.length > 0 &&
            badgesList.map((row, rowIndex) => (
              <div
                className="badges-container__table__main__row"
                key={"badges-container__table__main__row" + rowIndex}
              >
                <span>
                  <img src={url + row.badge_image} />
                </span>
                <span
                  style={{
                    textAlign: row.badge_name.length > 16 ? "start" : "center",
                  }}
                >
                  {row.badge_name}
                </span>
                <span>
                  {row.owners_quantity ? row.owners_quantity : 0}/{row.quantity}
                </span>

                <span
                  className="badges-container__table__main__row__info-icon"
                  onMouseEnter={() => setShowedPopupId(rowIndex)}
                  onMouseLeave={() => setShowedPopupId(null)}
                >
                  <InfoIcon />
                </span>

                {row.owner_user_id === user.id && (
                  <span className="badges-container__table__main__row__delete-btn">
                    <BlueButton
                      formatId="badges_page_delete_button"
                      padding="6px 30px"
                      onClick={() => deleteBadge(row.id)}
                      fontSize="18px"
                    />
                  </span>
                )}

                {showedPopupId === rowIndex ? (
                  <div className="badges-container__table__main__row__popup">
                    <div className="title">{row.badge_name}</div>
                    <div className="desc">{row.badge_desc}</div>
                  </div>
                ) : (
                  <></>
                )}
              </div>
            ))}
        </div>
      </div> */}
    </div>
  );
};

export default BadgesContainer;
