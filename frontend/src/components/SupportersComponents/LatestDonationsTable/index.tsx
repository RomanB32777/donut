import axiosClient from "../../../axiosClient";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { MaticIcon, TronIcon } from "../../../icons/icons";

const titles = ["NAME", "DONATION", "USD", "DATE/TIME"];

const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const maxWidth = ["20%", "20%", "20%", "20%"];

const LatestDonationsTable = () => {
  const data = useSelector((state: any) => state.personInfoPage).data.data;

  const [tronUsdtKoef, setTronUsdtKoef] = useState<number>(0);

  const getPrice = async () => {
    const res: any = await axiosClient.get(
      "https://www.binance.com/api/v3/ticker/price?symbol=TRXUSDT"
    );
    setTronUsdtKoef(res.data.price);
  };

  useEffect(() => {
    getPrice();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="supporters-main-table">
      <div className="supporters-main-table__header">
        {titles.map((title, titleIndex) => (
          <div key={"supporters-main-table__header__panel" + titleIndex}>
            {title}
          </div>
        ))}
      </div>
      <div className="supporters-main-table__main">
        {data &&
          data.donations &&
          data.donations.length > 0 &&
          data.donations.map((row: any, rowIndex: number) => (
            <div
              className="supporters-main-table__main__row"
              key={"supporters-main-table__main__row" + rowIndex}
            >
              <span>{row.username}</span>
              <span>
                {row.sum_donation}
                {row.wallet_type === "tron" ? <TronIcon /> : <MaticIcon />}
              </span>
              <span>
                {"$ " + Math.round(parseFloat(row.sum_donation) * tronUsdtKoef)}
              </span>
              <span>
                {months[parseInt(row.donation_date.slice(5, 7)) - 1] +
                  " " +
                  row.donation_date.slice(8, 10) +
                  " " +
                  row.donation_date.slice(0, 4) +
                  " / " +
                  row.donation_date.slice(11, 16)}
              </span>
            </div>
          ))}
      </div>
    </div>
  );
};

export default LatestDonationsTable;
