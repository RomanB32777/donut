import { useEffect, useState } from "react";
import { FormattedMessage } from "react-intl";

import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import axiosClient, { baseURL } from "../../axiosClient";
import BlueButton from "../../commonComponents/BlueButton";
import PageTitle from "../../commonComponents/PageTitle";
import { url } from "../../consts";
import { InfoIcon } from "../../icons/icons";
import routes from "../../routes";
import "./styles.sass";

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
            : "backer/" + user.username
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
    (res.status === 200) && user.id && getBadges(user.id);
  };

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

      <div className="badges-container__table">
        <div className="badges-container__table__header">
          {tableHeaderTitles.map((title, titleIndex) => (
            <div key={"badges_page_table_header_" + title}>
              <FormattedMessage id={"badges_page_table_header_" + title} />
            </div>
          ))}
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
                  onMouseEnter={() => {
                    console.log(rowIndex);
                    setShowedPopupId(rowIndex);
                  }}
                  onMouseLeave={() => setShowedPopupId(null)}
                >
                  <InfoIcon />
                </span>

                <span className="badges-container__table__main__row__delete-btn">
                  <BlueButton
                    formatId="badges_page_delete_button"
                    padding="6px 30px"
                    onClick={() => deleteBadge(row.id)}
                    fontSize="18px"
                  />
                </span>

                {showedPopupId === rowIndex ? (
                  <div className="badges-container__table__main__row__popup">
                    <span className="title">{row.badge_name}</span>
                    <div className="desc">{row.badge_desc}</div>
                  </div>
                ) : (
                  <></>
                )}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default BadgesContainer;
