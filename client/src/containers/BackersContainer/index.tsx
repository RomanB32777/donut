import { useEffect, useState } from "react";
import { FormattedMessage } from "react-intl";
import { baseURL } from "../../axiosClient";
import { url } from "../../consts";
import {
  DonutIcon,
  FlagIcon,
  MaticIcon,
  ShieldIcon,
  TronIcon,
} from "../../icons/icons";
import "./styles.sass";

import testImg from "../../assets/tronlink_big.png";

const topDonationsWidth = {
  supporter: "36%",
  creator: "36%",
  donation: "16%",
};

const BackersContainer = () => {
  const [backers, setBackers] = useState({
    sum: 0,
    topDonations: [],
    supporters: [],
  });

  const [onMouseOverIdType, setOnMouseOverIdType] = useState({
    index: 100000000,
    type: "",
  });

  const getBackers = async () => {
    const res = await fetch(baseURL + "/api/donation/backers-info/");
    if (res.status === 200) {
      const result = await res.json();

      const supporters = await Promise.all(
        result.supporters.map(async (s: any) => {
          const badges = await Promise.all(
            s.badges.map(async (b: any) => {
              const ownerUserName = await getUsernameByID(b.owner_user_id);
              return { ...b, ownerUserName };
            })
          );
          return { ...s, badges };
        })
      );

      setBackers({ ...result, supporters });
    }
  };

  const getUsernameByID = async (id: number) => {
    const res = await fetch(baseURL + `/api/user/id/${id}`);
    if (res.status === 200) {
      const result = await res.json();
      return result.user.username;
    }
  };

  useEffect(() => {
    getBackers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="backers-container">
      <div className="backers-container__left-side">
        {backers.supporters &&
          backers.supporters.length > 0 &&
          backers.supporters.map((supporter: any, supporterIndex: number) => (
            <div
              className="backers-container__left-side__supporter"
              key={"backers-container__left-side__supporter" + supporterIndex}
            >
              <div className="backers-container__left-side__supporter__panel">
                <span>{supporter.username}</span>
                <div>
                  {supporter.donations.length > 0 && (
                    <div
                      onMouseEnter={() =>
                        setOnMouseOverIdType({
                          index: supporterIndex,
                          type: "dns",
                        })
                      }
                      // onMouseLeave={() =>
                      //   setOnMouseOverIdType({ index: 10000000, type: "" })
                      // }
                    >
                      <DonutIcon />
                    </div>
                  )}

                  {supporter.follows.length > 0 && (
                    <div
                      onMouseEnter={() =>
                        setOnMouseOverIdType({
                          index: supporterIndex,
                          type: "fls",
                        })
                      }
                      onMouseLeave={() =>
                        setOnMouseOverIdType({ index: 10000000, type: "" })
                      }
                    >
                      <FlagIcon />
                    </div>
                  )}

                  {supporter.badges.length > 0 && (
                    <div
                      onMouseEnter={() =>
                        setOnMouseOverIdType({
                          index: supporterIndex,
                          type: "bgs",
                        })
                      }
                      onMouseLeave={() =>
                        setOnMouseOverIdType({ index: 10000000, type: "" })
                      }
                    >
                      <ShieldIcon />
                    </div>
                  )}
                </div>
              </div>

              {supporterIndex === onMouseOverIdType.index &&
                ((onMouseOverIdType.type === "dns" &&
                  supporter.donations &&
                  supporter.donations.length > 0 && (
                    <div
                      className="backers-container__left-side__supporter__popup"
                      style={{
                        right: "0px",
                        width: "280px",
                      }}
                    >
                      <span className="title">Latest donations</span>
                      <div className="list">
                        {supporter.donations
                          .sort(
                            (a: any, b: any) =>
                              new Date(b.donation_date).getTime() -
                              new Date(a.donation_date).getTime()
                          )
                          .slice(0, 3)
                          .map((dns: any) => (
                            <div
                              key={
                                "dns" + dns.creator_username + dns.sum_donation
                              }
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                              }}
                            >
                              <span>{dns.creator_username}</span>
                              <span>
                                {dns.sum_donation}
                                {dns.wallet_type === "tron" ? (
                                  <TronIcon />
                                ) : (
                                  <MaticIcon />
                                )}
                              </span>
                            </div>
                          ))}
                      </div>
                    </div>
                  )) ||
                  (onMouseOverIdType.type === "bgs" &&
                    supporter.badges &&
                    supporter.badges.length > 0 && (
                      <div
                        className="backers-container__left-side__supporter__popup backers-container__left-side__supporter__popup_bgs"
                        style={{
                          right: "0px",
                          width: "280px",
                        }}
                      >
                        <span className="title">Badges</span>
                        <div className="list">
                          {supporter.badges.slice(0, 3).map((bgs: any) => {
                            return (
                              <div
                                className="badgeItem"
                                key={"bgs" + bgs.name + Math.random()}
                              >
                                <span
                                  style={{
                                    justifyContent: "flex-start",
                                    minWidth: "70px",
                                  }}
                                >
                                  <img src={url + bgs.badge_image} alt="bgs" />
                                </span>
                                <div className="list-item_txt">
                                  <span
                                    style={{
                                      justifyContent:
                                        // bgs.badge_name && bgs.badge_name.length > 10
                                        "flex-start",
                                      // : "center",
                                      // marginLeft:
                                      //   bgs.badge_name &&
                                      //   bgs.badge_name.length > 20
                                      //     ? "20px"
                                      //     : "0",
                                    }}
                                  >
                                    {bgs.badge_name}
                                  </span>
                                  <span
                                    className="ownerName"
                                    style={{
                                      justifyContent:
                                        bgs.owner_username &&
                                        bgs.owner_username.length > 10
                                          ? "flex-start"
                                          : "center",
                                    }}
                                  >
                                    by {bgs.ownerUserName}
                                  </span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )) ||
                  (onMouseOverIdType.type === "fls" &&
                    supporter.follows &&
                    supporter.follows.length > 0 && (
                      <div
                        className="backers-container__left-side__supporter__popup"
                        style={{
                          right: "0px",
                          width: "160px",
                        }}
                      >
                        <span className="title">Follows</span>
                        <div className="list">
                          {supporter.follows
                            // .slice(0,3)
                            .map((fls: any) => (
                              <div
                                key={"fls" + fls.creator_username}
                                style={{
                                  justifyContent: "center",
                                }}
                              >
                                <span
                                  style={{
                                    maxWidth: "100%",
                                    width: "100%",
                                    justifyContent:
                                      fls.creator_username.length < 13
                                        ? "center"
                                        : "flex-start",
                                  }}
                                >
                                  {fls.creator_username}
                                </span>
                              </div>
                            ))}
                        </div>
                      </div>
                    )))}
            </div>
          ))}
      </div>

      <div className="backers-container__right-side">
        <div className="backers-container__right-side__sum">
          <span className="backers-container__right-side__sum__title">
            <FormattedMessage id="backers_page_sum_title" />
          </span>
          <div className="backers-container__right-side__sum__value">
            {backers.sum.toFixed(2)} USD
            {/* <TronIcon /> */}
          </div>
        </div>

        <div className="backers-container__right-side__top-donations">
          <span className="backers-container__right-side__top-donations__title">
            <FormattedMessage id="backers_page_top_donations_title" />
          </span>

          <div className="backers-container__right-side__top-donations__table">
            <div className="backers-container__right-side__top-donations__table__header">
              <span>Supporter</span>
              <span>Creator</span>
              <span>Donation</span>
            </div>
            {backers.topDonations.map((donation: any, dIn) => (
              <div
                key={
                  "backers-container__right-side__top-donations__table__panel" +
                  dIn
                }
                className="backers-container__right-side__top-donations__table__panel"
              >
                <span
                  style={{
                    justifyContent:
                      donation.username.length > 10 ? "flex-start" : "center",
                  }}
                >
                  {donation.username}
                </span>
                <span
                  style={{
                    justifyContent:
                      donation.creator_username.length > 10
                        ? "flex-start"
                        : "center",
                  }}
                >
                  {donation.creator_username}
                </span>
                <span>
                  {donation.sum_donation.indexOf(".") === 0 && "0"}
                  {donation.sum_donation}
                  <span className="table_wallet-icon">
                    {donation.wallet_type === "tron" ? (
                      <TronIcon />
                    ) : (
                      <MaticIcon />
                    )}
                  </span>
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BackersContainer;
