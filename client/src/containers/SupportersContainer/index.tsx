import axiosClient, { baseURL } from "../../axiosClient";
import { useContext, useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import PageTitle from "../../commonComponents/PageTitle";
import {
  CalendarIcon,
  CopyIcon,
  SmallToggleListArrowIcon,
  TronIcon,
} from "../../icons/icons";
import "./styles.sass";
import CanvasJSReact from "../../assets/canvasjs.react";
import { FormattedMessage } from "react-intl";
import { url } from "../../consts";
import Calendar from "../../components/Calendar";
import { addNotification, addSuccessNotification } from "../../utils";
import { WebSocketContext } from "../../components/Websocket/WebSocket";
//var CanvasJSReact = require('./canvasjs.react');
var CanvasJS = CanvasJSReact.CanvasJS;
var CanvasJSChart = CanvasJSReact.CanvasJSChart;

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const titles = ["NAME", "DONATIONS SUM", "USD", "TRANSACTIONS"];

const Table = (prop: { supporters: any; badges: any; getBadges: any }) => {
  const [idBadgePopup, setIdBadgePopup] = useState<number | null>(null);
  const [tronUsdtKoef, setTronUsdtKoef] = useState<number>(0);

  const [supporters, setSupporters] = useState<any>();

  const [sorting, setSorting] = useState<any>({
    type: "",
    sort: "UP",
  });

  const socket = useContext(WebSocketContext);

  const user = useSelector((state: any) => state.user);

  const sort = (type: string) => {
    if (type === "sum") {
      let transactions = prop.supporters
        .map((sup: any) => parseFloat(sup.sum_donation))
        .sort(function (a: any, b: any) {
          return a - b;
        });
      let sortedTrans: any = {};
      transactions.forEach((elem: any) => {
        sortedTrans[elem] = [];
      });
      prop.supporters.forEach((sup: any) => {
        let safd = sup.sum_donations;
        if (sortedTrans[safd] && sortedTrans[safd].length > 0) {
          sortedTrans[safd] = [...sortedTrans[safd], sup];
        } else {
          sortedTrans[safd] = [sup];
        }
      });
      let res: any[] = [];
      Object.keys(sortedTrans).forEach(
        (trans: any) => (res = [...res, ...sortedTrans[trans]])
      );

      if (sorting.sort === "UP") {
        setSorting({ type: type, sort: "DOWN" });
        setSupporters(res.reverse());
      } else {
        setSorting({ type: type, sort: "UP" });
        setSupporters(res);
      }
    } else if (type === "trans") {
      let transactions = prop.supporters
        .map((sup: any) => sup.amount_donations)
        .sort(function (a: any, b: any) {
          return a - b;
        });
      let sortedTrans: any = {};
      transactions.forEach((elem: any) => {
        sortedTrans[elem] = [];
      });
      prop.supporters.forEach((sup: any) => {
        let safd = sup.amount_donations;
        if (sortedTrans[safd] && sortedTrans[safd].length > 0) {
          sortedTrans[safd] = [...sortedTrans[safd], sup];
        } else {
          sortedTrans[safd] = [sup];
        }
      });
      let res: any[] = [];
      Object.keys(sortedTrans).forEach(
        (trans: any) => (res = [...res, ...sortedTrans[trans]])
      );

      if (sorting.sort === "UP") {
        setSorting({ type: type, sort: "DOWN" });
        setSupporters(res.reverse());
      } else {
        setSorting({ type: type, sort: "UP" });
        setSupporters(res);
      }
    }
  };

  const assignBadge = async (badge: any, supporter: any) => {
    const res = await axiosClient.post("/api/badge/assign-badge", {
      badge_id: badge.id,
      ...badge,
      contributor_id: supporter.backer_id,
    });

    // {
    //   method: "POST", // *GET, POST, PUT, DELETE, etc.
    //   mode: "cors", // no-cors, *cors, same-origin
    //   cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
    //   credentials: "same-origin", // include, *same-origin, omit
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   redirect: "follow", // manual, *follow, error
    //   referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url

    //   body: JSON.stringify({
    //     badge_id: badge.id,
    //     ...badge,
    //     contributor_id: supporter.backer_id,
    //   }),
    // }

    if (res.status === 200) {
      setIdBadgePopup(null);
      addSuccessNotification(
        `Badge added successfully to ${supporter.username}`
      );
      user.id && prop.getBadges(user.id);

      socket &&
        res.data &&
        supporter &&
        socket.emit("new_badge", {
          supporter: { username: supporter.username, id: supporter.backer_id },
          creator_id: res.data.assignedBadge.owner_user_id,
          badgeID: res.data.assignedBadge.id,
          badgeName: res.data.assignedBadge.badge_name,
        });
    }
  };

  const getPrice = async () => {
    const res: any = await axiosClient.get(
      "https://www.binance.com/api/v3/ticker/price?symbol=TRXUSDT"
    );
    setTronUsdtKoef(res.data.price);
  };

  useEffect(() => {
    getPrice();
    setSupporters(prop.supporters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prop.supporters]);

  return (
    <div className="supporters-container__table">
      <div className="supporters-container__table__header">
        <div>NAME</div>
        <div onClick={() => sort("sum")}>
          DONATIONS SUM
          <div
            className={
              sorting.type === "sum" && sorting.sort === "DOWN" ? "rotated" : ""
            }
          >
            <SmallToggleListArrowIcon />
          </div>
        </div>
        <div>USD</div>
        <div onClick={() => sort("trans")}>
          TRANSACTIONS
          <div
            className={
              sorting.type === "trans" && sorting.sort === "DOWN"
                ? "rotated"
                : ""
            }
          >
            <SmallToggleListArrowIcon />
          </div>
        </div>
      </div>
      <div className="supporters-container__table__main">
        {supporters &&
          supporters.length > 0 &&
          supporters.map((row: any, rowIndex: number) => (
            <div
              key={"supporters-container__table__main__row" + rowIndex}
              className="supporters-container__table__main__row"
            >
              <span
                onMouseEnter={() => setIdBadgePopup(rowIndex)}
                onMouseLeave={() =>
                  setTimeout(() => setIdBadgePopup(null), 3000)
                }
              >
                {row.username}
              </span>
              <span>
                {row.sum_donations}
                <TronIcon />
              </span>
              <span>
                {"$ " +
                  Math.round(parseFloat(row.sum_donations) * tronUsdtKoef)}
              </span>
              <span>{row.amount_donations || ""}</span>

              {rowIndex === idBadgePopup && (
                <div
                  className="supporters-container__table__main__row__popup"
                  onMouseEnter={() => setIdBadgePopup(rowIndex)}
                  onMouseLeave={() =>
                    setTimeout(() => setIdBadgePopup(null), 2000)
                  }
                >
                  <span className="title">
                    <FormattedMessage id="supporters_popup_title" />
                  </span>
                  <div className="supporters-container__table__main__row__popup__list">
                    {prop.badges.map((badge: any) => (
                      <div
                        onClick={() => {
                          if (
                            badge.owners_quantity < badge.quantity &&
                            (badge.contributor_user_id_list.includes(
                              ` ${row.id} `
                            ) ||
                              !(
                                badge.contributor_user_id_list.slice(
                                  0,
                                  badge.contributor_user_id_list.indexOf(" ")
                                ) === `${row.id}`
                              ))
                          ) {
                            assignBadge(badge, row);
                          }
                        }}
                      >
                        <span>
                          <img src={url + badge.badge_image} />
                        </span>
                        <span
                          style={{
                            justifyContent:
                              badge.badge_name.length > 10
                                ? "flex-start"
                                : "center",
                          }}
                        >
                          {badge.badge_name}
                        </span>
                        <span>
                          {badge.quantity - badge.owners_quantity || 0}/
                          {badge.quantity}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
      </div>
    </div>
  );
};

const SupportersContainer = () => {
  const user = useSelector((state: any) => state.user);

  const [isShowCalendar, setIsShowCalendar] = useState<boolean>(false);

  const [supporters, setSupporters] = useState<any[]>([]);
  const [donations, setDonations] = useState<any[]>([]);

  const [badgesList, setBadgesList] = useState<any[]>([]);

  const [date, setDate] = useState({
    start: "",
    end: "",
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    //  parseInt(new Date().toISOString().slice(5,7))-1
  });

  const getBadges = async (id: string) => {
    const res = await fetch(baseURL + "/api/badge/get-badges-by-creator/" + id);
    if (res.status === 200) {
      const result = await res.json();
      setBadgesList(result.badges);
    }
  };

  const getData = async (id: any) => {
    const res = await fetch(baseURL + "/api/donation/supporters/" + id);
    if (res.status === 200) {
      const result = await res.json();
      // setSupporters(result.supporters);
      setDonations(result.donations);
    }
  };

  const [dailyDonations, setDailyDonations] = useState<any>([]);
  const [timesDonations, setTimesDonations] = useState<any>([]);

  const getDailyDonations = (date: any) => {
    let dates: { [key: string]: number } = {};
    let times: { [key: string]: number } = {};
    let tableData: {
      [key: string]: { donations_sum: number; count: number; id: number };
    } = {};
    let oneDay: number;

    donations.forEach((donation) => {
      const username = donation.username;
      const donation_month = donation.donation_date.slice(5, 7);

      if (donation_month !== date.month.toString()) {
        if (
          date.end.length !== 0 && date.start.length !== 0
            ? parseInt(donation.donation_date.slice(8, 10)) <=
                parseInt(date.end) &&
              parseInt(donation.donation_date.slice(8, 10)) >=
                parseInt(date.start)
            : true
        ) {
          const day: string =
            donation.donation_date.slice(8, 10) + "." + donation_month;

          tableData = {
            ...tableData,
            [username]: {
              id: donation.backer_id,
              donations_sum:
                ((tableData[username] && tableData[username].donations_sum) ||
                  0) + parseFloat(donation.sum_donation),
              count:
                ((tableData[username] && tableData[username].count) || 0) + 1,
            },
          };

          dates = {
            ...dates,
            [day]: (dates[day] || 0) + parseFloat(donation.sum_donation),
          };
        }
      }
    });

    const datesArr = Object.keys(dates);
    if (datesArr.length > 1) {
      setDailyDonations(
        datesArr.map((elem) => ({
          x: new Date(
            date.year,
            date.month - 1,
            parseInt(elem.slice(0, elem.indexOf(".")))
          ),
          y: dates[elem],
        }))
      );
    }
    if (datesArr.length === 1) {
      tableData = {};
      donations.forEach((donation) => {
        // иначе действия на вывод по часовой выдачи донатов за день
        const username = donation.username;
        if (
          date.end.length !== 0 && date.start.length !== 0
            ? parseInt(donation.donation_date.slice(8, 10)) <=
                parseInt(date.end) &&
              parseInt(donation.donation_date.slice(8, 10)) >=
                parseInt(date.start)
            : true
        ) {
          const formatDate = new Date(donation.donation_date);
          const dateWithOffset = new Date(
            formatDate.getTime() + formatDate.getTimezoneOffset() * 60 * 1000
          );
          oneDay = dateWithOffset.getDate();
          const time = `${dateWithOffset.getHours()}:${String(
            dateWithOffset.getMinutes()
          ).padStart(2, "0")}`;

          tableData = {
            ...tableData,
            [username]: {
              id: donation.backer_id,
              donations_sum:
                ((tableData[username] && tableData[username].donations_sum) ||
                  0) + parseFloat(donation.sum_donation),
              count:
                ((tableData[username] && tableData[username].count) || 0) + 1,
            },
          };

          times = {
            ...times,
            [time]: (times[time] || 0) + parseFloat(donation.sum_donation),
          };
        }
      });
      const timesArr = Object.keys(times);
      setTimesDonations(
        timesArr.map((elem) => ({
          x: new Date(
            date.year,
            date.month - 1,
            oneDay,
            parseInt(elem.slice(0, elem.indexOf(":"))),
            parseInt(elem.slice(elem.indexOf(":") + 1))
          ),
          y: times[elem],
          label: elem,
        }))
      );
    }
    const formatTableData = Object.keys(tableData).map((username) => ({
      username,
      backer_id: tableData[username].id,
      sum_donations: tableData[username].donations_sum,
      amount_donations: tableData[username].count,
    }));
    setSupporters(formatTableData);
  };

  const handleClick = (event: any) => {
    if (
      event &&
      event.target &&
      event.target.className &&
      event.target.className.includes("calendar")
    ) {
      setIsShowCalendar(true);
    } else {
      setIsShowCalendar(false);
    }
  };

  useEffect(() => {
    if (user.id) {
      getData(user.id);
      getBadges(user.id);
    }

    document.addEventListener("click", handleClick);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isDailyDonations = useMemo(
    () => dailyDonations.length > 1,
    [dailyDonations]
  );

  return (
    <div className="supporters-container">
      <PageTitle formatId="supporters_page_title" />

      <CanvasJSChart
        options={{
          theme: "dark1",
          backgroundColor: "black",

          axisY: {
            gridThickness: 0,
          },
          axisX: {
            gridThickness: 0,
            title:
              !isDailyDonations && Boolean(timesDonations.length)
                ? String(timesDonations[0].x.getDate()).padStart(2, "0") +
                  ` ${months[date.month - 1]}`
                : months[date.month - 1],
            valueFormatString: isDailyDonations ? "DD, MMM" : "HH:mm",
            intervalType: isDailyDonations ? "day" : "hour",
            interval:
              dailyDonations.length > 2 || timesDonations.length > 2 ? 1 : 0,
            // labelFontSize: 30,
          },
          toolTip: {
            fontSize: 20,
          },
          data: [
            {
              type: "spline",
              color: "#1D14FF",
              dataPoints: isDailyDonations ? dailyDonations : timesDonations,
            },
          ],
        }}
      />

      <div className="supporters-container__calendar-wrapper">
        <span>
          <FormattedMessage id="supporters_calendar_title" />
        </span>
        <div
          className="button"
          onClick={() => {
            if (isShowCalendar) {
              setIsShowCalendar(false);
            } else {
              setIsShowCalendar(true);
            }
          }}
        >
          <span className="supporters_calendar_button">
            <FormattedMessage id="supporters_calendar_button" />
          </span>
          <CalendarIcon />
        </div>

        {isShowCalendar && (
          <div className="calendar-popup">
            <Calendar
              setCurrentDate={(type: string, day: any) => {
                setDate({ ...date, [type]: day });
                if (type === "end") {
                  getDailyDonations({ ...date, [type]: day });
                }
              }}
              setCurrentMonth={(month: any) =>
                setDate({ ...date, month: month })
              }
              setStartDate={(day: any) =>
                setDate({ ...date, start: day, end: "" })
              }
              currentDate={date}
            />
          </div>
        )}
      </div>

      <div className="supporters-container__line" />

      <div className="supporters-container__description">
        <span className="title">
          <FormattedMessage id="supporters_aud_info_title" />
        </span>
        <div className="link-wrapper">
          <span>
            <FormattedMessage id="supporters_aud_info_subtitle" />
          </span>
          <div className="link">
            {baseURL}/donat/{user.username}
          </div>
          <div
            className="icon"
            onClick={() => {
              console.log(baseURL, user.username);
              
              navigator.clipboard.writeText(
                `${baseURL}/donat/${user.username}` 
              );
              addNotification({
                type: "success",
                title: "Link successfully copied",
              });
            }}
          >
            <CopyIcon />
          </div>
        </div>
      </div>

      <Table
        supporters={supporters}
        badges={badgesList}
        getBadges={getBadges}
      />
    </div>
  );
};

export default SupportersContainer;
