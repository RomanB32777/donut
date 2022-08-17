import axiosClient from "../../../axiosClient";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { url } from "../../../consts";
import getTronWallet from "../../../functions/getTronWallet";
import { LargeImageIcon, PencilIcon, UploadIcon } from "../../../icons/icons";
import { useLocation } from "react-router";
import "./styles.sass";
import { tryToGetPersonInfo } from "../../../store/types/PersonInfo";

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

const PersonMainInfo = () => {
  const dispatch = useDispatch();
  const tron_token = getTronWallet();
  const data = useSelector((state: any) => state.personInfo).main_info;

  const user = useSelector((state: any) => state.user);

  const { pathname } = useLocation();

  const [isMouseOnAvatar, setIsMouseOnAvatar] = useState<boolean>(false);

  const [file, setFile] = useState<any>();
  const [fileName, setFileName] = useState("");
  const [imagebase64, setImagebase84] = useState<any>("");

  const isEditMode: boolean = tron_token === data.tron_token;

  const sendFile = (file: any, fileName: any) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("fileName", fileName);
    if (user && user.id) {
      axiosClient.post("/api/user/user/edit-image/" + user.id, formData);
      dispatch(
        tryToGetPersonInfo({
          username: pathname.slice(pathname.indexOf("@")),
        })
      );
    }
  };

  const fileToBase64 = (file: any) => {
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => setImagebase84(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const saveFile = (ev: any) => {
    setFile(ev.target.files[0]);
    fileToBase64(ev.target.files[0]);
    setFileName(ev.target.files[0].name);
    sendFile(ev.target.files[0], ev.target.files[0].name);
  };

  useEffect(() => {
    dispatch(
      tryToGetPersonInfo({ username: pathname.slice(pathname.indexOf("@")) })
    );
  }, [dispatch, pathname]);

  return (
    <div className="person-main-info">
      <div
        className="person-main-info__picture"
        onMouseEnter={() => setIsMouseOnAvatar(true)}
        onMouseLeave={() => setIsMouseOnAvatar(false)}
      >
        {(data.avatarlink && data.avatarlink.length > 0) ||
        imagebase64.length > 0 ? (
          <img
            src={
              fileName.length > 0
                ? imagebase64 || ""
                : data.avatarlink &&
                  data.avatarlink.length > 0 &&
                  `${url + data.avatarlink}`
            }
          />
        ) : (
          <div className="icon" />
        )}

        {isEditMode && <input type="file" onChange={saveFile} />}
        {
          <div
            className="person-main-info__picture__back"
            style={{
              opacity: isMouseOnAvatar && isEditMode ? "1" : "0",
            }}
          >
            <UploadIcon />
            <span>600x600px</span>
          </div>
        }
      </div>
      <div className="person-main-info__personal">
        <span className="title">{data.person_name}</span>
        <span className="subtitle">{data.username}</span>
      </div>
      <div className="person-main-info__date">
        Joined in
        {data.creation_date && data.creation_date.length > 10
          ? " " +
            months[data.creation_date.slice(6, 7) - 1] +
            " " +
            data.creation_date.slice(0, 4)
          : " " + new Date().toISOString().slice(0, 4)}
      </div>
    </div>
  );
};

export default PersonMainInfo;
