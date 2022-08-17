import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import clsx from "clsx";
import { url } from "../../consts";
import { LargeImageIcon, TrashBinIcon, UploadIcon } from "../../icons/icons";
import "./styles.sass";

import testIMG from "../../assets/person.png";
import { FormattedMessage } from "react-intl";
import axiosClient from "../../axiosClient";
import { tryToGetPersonInfo } from "../../store/types/PersonInfo";

import Space from "../../space.png";
import getTronWallet from "../../functions/getTronWallet";

// interface IContentCard {
//   name: string;
//   creator_id: string;
//   link?: string;
//   image?: string;
//   desc?: string;
// }
// prop: { data: IContentCard; onClick?: () => void }
const ProfileBanner = ({
  saveBtn,
  isEditMode,
  sendBannerFile,
}: {
  saveBtn: boolean;
  isEditMode: boolean;
  sendBannerFile: boolean;
}) => {
  const data = useSelector((state: any) => state.personInfo).main_info;
  const tron_token = getTronWallet();

  const [file, setFile] = useState<any>();
  const [fileName, setFileName] = useState("");
  const [imagebase64, setImagebase84] = useState<any>("");

  const [isMouseOnBackground, setIsMouseOnBackground] =
    useState<boolean>(false);

  // const isEditMode: boolean = useMemo(
  //   () => tron_token === data.tron_token,
  //   [tron_token, data]
  // );

  const sendFile = () => {
    const formData = new FormData();
    if (file && fileName) {
      formData.append("file", file);
      formData.append("fileName", fileName);
      axiosClient.post(
        "/api/user/user/edit-background/" + tron_token,
        formData
      );
      setFileName("");
      setFile("");
      setImagebase84("");
      // dispatch(
      //   tryToGetPersonInfo({ username: pathname.slice(pathname.indexOf("@")) })
      // );
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
  };

  useEffect(() => {
    sendBannerFile && sendFile();
  }, [sendBannerFile]);

  return (
    <div
      className="person-info-container__background"
      onMouseEnter={() => setIsMouseOnBackground(true)}
      onMouseLeave={() => setIsMouseOnBackground(false)}
    >
      {(fileName.length > 0 ||
        (data.backgroundlink && data.backgroundlink.length > 0)) && (
        <img src={imagebase64 || `${url + data.backgroundlink}`} alt="banner" />
      )}
      {isEditMode && <input type="file" onChange={saveFile} />}

      {saveBtn && (
        <div
          className="person-info-container__background__save"
          style={{
            opacity: fileName.length > 0 ? "1" : "0",
          }}
          onClick={() => {
            isEditMode && sendFile();
          }}
        >
          Save
        </div>
      )}
      <div
        className="person-info-container__background__dark"
        style={{
          opacity: isMouseOnBackground && isEditMode ? "0.8" : "0",
        }}
      >
        <div>
          <UploadIcon />
          <span>
            <FormattedMessage id="profile_info_background_title" />
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProfileBanner;
