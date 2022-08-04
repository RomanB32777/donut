import { useState } from "react";
import { useEffect } from "react";
import { useLayoutEffect, useRef } from "react";
import { LeftArrowIcon, RightArrowIcon } from "../../icons/icons";
import "./styles.sass";

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

const Calendar = (props: {
  currentDate?: any;
  setCurrentDate: any;
  setCurrentMonth: any;
  setStartDate: any;
}) => {
  const [date, setDate] = useState({
    start: "",
    end: "",
    month: new Date().getMonth() + 1,
  });

  const [data, setData] = useState<any>("");

  const handleClick = (event: any) => {
    if (
      event.target.className.includes(
        "calendar-wrapper__calendar__main__active"
      )
    ) {
      if (date.start === "") {
        console.log(1);
        props.setCurrentDate("start", event.target.innerText);
        setDate({ ...date, start: event.target.innerText });
      } else if (date.start.length > 0 && date.end === "") {
        console.log(2);
        props.setCurrentDate("end", event.target.innerText);
        setDate({ ...date, end: event.target.innerText });
      } else if (date.start.length > 0 && date.end.length > 0) {
        //props.setCurrentDate('end', '')
        console.log(3);
        setDate({ ...date, start: event.target.innerText, end: "" });
        props.setStartDate(event.target.innerText);
        //props.setCurrentDate('start', event.target.innerText)
      }
    }
  };

  const firstUpdate = useRef(true);

  useLayoutEffect(() => {
    if (firstUpdate.current) {
      firstUpdate.current = false;
      return;
    }
    document
      ?.getElementById("calendar")
      ?.addEventListener("click", handleClick);
  });

  function createCalendar(year: any, month: any): any {
    let mon = month; // месяцы в JS идут от 0 до 11, а не от 1 до 12
    let d = new Date(year, mon);
    console.log("createCalendar", d.getMonth(), mon);
    
    // let prevD = new Date(year, mon - 1);
    // let nextD = new Date(year, mon + 1);

    let table = `<table><tr class=${"calendar-wrapper__calendar__header"}><th>Mon</th><th>Thr</th><th>Wed</th><th>Thu</th><th>Fri</th><th>Sat</th><th>Sun</th></tr><tr class=${"calendar-wrapper__calendar__main"}>`;

    for (let i = 0; i < getDay(d); i++) {
      table += `<td class=${"additional"}></td>`;
    }

    while (d.getMonth() === mon) {
      if (
        (d.getDate().toString().length === 1
          ? "0" + d.getDate().toString()
          : d.getDate().toString()) === date.start ||
        (d.getDate().toString().length === 1
          ? "0" + d.getDate().toString()
          : d.getDate().toString()) === date.end ||
        (date.end.length !== 0 && date.start.length !== 0
          ? parseInt(
              d.getDate().toString().length === 1
                ? "0" + d.getDate().toString()
                : d.getDate().toString()
            ) > parseInt(date.start) &&
            parseInt(
              d.getDate().toString().length === 1
                ? "0" + d.getDate().toString()
                : d.getDate().toString()
            ) < parseInt(date.end)
          : false)
      ) {
        table += `<td class="choosen calendar-wrapper__calendar__main__active">${
          d.getDate().toString().length === 1 ? "0" + d.getDate() : d.getDate()
        }</td>`;
      } else {
        table += `<td class="calendar-wrapper__calendar__main__active">${
          d.getDate().toString().length === 1 ? "0" + d.getDate() : d.getDate()
        }</td>`;
      }

      if (getDay(d) % 7 === 6) {
        // вс, последний день - перевод строки
        table += `</tr><tr class=${"calendar-wrapper__calendar__main"}>`;
      }

      d.setDate(d.getDate() + 1);
    }

    // добить таблицу пустыми ячейками, если нужно
    // 29 30 31 * * * *
    if (getDay(d) !== 0) {
      for (let i = getDay(d); i < 7; i++) {
        table += `<td class=${"additional"}></td>`;
      }
    }

    // закрыть таблицу
    table += "</tr></table>";

    return table;
  }

  useEffect(() => {
    console.log("no");
    setData(createCalendar(new Date().getMonth(), date.month));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date]);

  function getDay(date: any) {
    // получить номер дня недели, от 0 (пн) до 6 (вс)
    let day = date.getDay();
    if (day === 0) day = 7; // сделать воскресенье (0) последним днем
    return day - 1;
  }

  return (
    <div className="calendar-wrapper">
      <div className="calendar-wrapper__header">
        <div
          onClick={() => {
            console.log(date);

            if (date.month === 0) {
              props.setCurrentMonth(0);
            } else {
              props.setCurrentMonth(date.month - 1);
            }
          }}
        >
          <LeftArrowIcon />
        </div>
        <span>{months[date.month - 1]}</span>
        <div
          onClick={() => {
            if (date.month === 11) {
              props.setCurrentMonth(0);
            } else {
              props.setCurrentMonth(date.month + 1);
            }
          }}
        >
          <RightArrowIcon />
        </div>
      </div>
      <div
        className="calendar-wrapper__calendar"
        id="calendar"
        dangerouslySetInnerHTML={{ __html: data || "" }}
      />
    </div>
  );
};

export default Calendar;
