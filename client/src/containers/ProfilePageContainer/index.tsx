import axiosClient, { baseURL } from "../../axiosClient";
import { useCallback, useEffect, useMemo, useState } from "react";
import { FormattedMessage } from "react-intl";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import BlueButton from "../../commonComponents/BlueButton";
import PageTitle from "../../commonComponents/PageTitle";
import { url } from "../../consts";
import asyncQuery from "../../functions/asyncQuery";
import getTronWallet, {
  getMetamaskWallet,
} from "../../functions/getTronWallet";
import {
  DiscordIcon,
  FacebookIcon,
  LargeImageIcon,
  TronIcon,
  TwitterIcon,
  UploadIcon,
  YoutubeIcon,
} from "../../icons/icons";
import routes from "../../routes";
import { setUser, tryToGetUser } from "../../store/types/User";

import "./styles.sass";
import ProfileBanner from "../../components/ProfileBanner";

const titles = [
  {
    title: "profile_form_title_name",
    Component: ({
      isNameExist,
      form,
      setIsChanged,
      setForm,
    }: {
      isNameExist?: boolean;
      form?: any;
      setIsChanged?: any;
      setForm?: any;
    }) => (
      <span>
        {isNameExist ? (
          form.person_name
        ) : (
          <input
            type="text"
            value={form.person_name}
            placeholder="Your name"
            onChange={(event) => {
              setIsChanged(true);
              setForm({ ...form, person_name: event.target.value });
            }}
          />
        )}
      </span>
    ),
  },
  {
    title: "profile_form_title_username",
    Component: ({ form }: { form?: any }) => <span>{form.username}</span>,
  },
  {
    title: "profile_form_title_description",
    Component: ({ form, setForm }: { form?: any; setForm?: any }) => (
      // <span>{form.user_description}</span>
      <textarea
        value={form["user_description"]}
        placeholder="Tell us more about yourself"
        onChange={(event) => {
          // setIsChanged(true);
          setForm({ ...form, user_description: event.target.value });
        }}
      />
    ),
  },
  {
    title: "profile_form_title_socials",
    Component: ({
      socials,
      form,
      setIsChanged,
      setForm,
    }: {
      socials?: any;
      form?: any;
      setIsChanged?: any;
      setForm?: any;
    }) => {
      return (
        <div className="profile-page__form__info__socials">
          {socials.map((social: any) => (
            <div key={"profile-page-social-form-" + social.title}>
              {social.icon}
              <input
                type="text"
                value={form[social.title]}
                placeholder={social.placeholder}
                onChange={(event) => {
                  setIsChanged(true);
                  setForm({ ...form, [social.title]: event.target.value });
                }}
              />
            </div>
          ))}
        </div>
      );
    },
  },
  {
    title: "profile_form_title_wallet",
    Component: ({ copyTron }: { copyTron?: (token: string) => void }) => {
      const [metaMaskWallet, setMetaMaskWallet] = useState<null | string>(null);
      const [tronWallet, setTronWallet] = useState<null | string>(null);

      const getMetaWallet = async () => {
        const walletMeta = await getMetamaskWallet();
        walletMeta && setMetaMaskWallet(walletMeta);

        const walletTron = getTronWallet();
        walletTron && setTronWallet(walletTron);
      };

      useEffect(() => {
        getMetaWallet();
      }, []);

      return (
        <div>
          <span onClick={() => copyTron && tronWallet && copyTron(tronWallet)}>
            <div className="wallet_row">
              <TronIcon />
              <span>
                {tronWallet && tronWallet.length > 20
                  ? tronWallet.slice(0, 6) +
                    "..." +
                    tronWallet.slice(tronWallet.length - 24)
                  : "mytoken"}
              </span>
            </div>
          </span>
          <span
            onClick={() =>
              copyTron && metaMaskWallet && copyTron(metaMaskWallet)
            }
          >
            <div className="wallet_row">
              <TronIcon />
              <span>
                {metaMaskWallet && metaMaskWallet.length > 30
                  ? metaMaskWallet.slice(0, 6) +
                    "..." +
                    metaMaskWallet.slice(metaMaskWallet.length - 26)
                  : "mytoken"}
              </span>
            </div>
          </span>
        </div>
      );
    },
  },
];

const socials = [
  {
    title: "facebook",
    icon: <FacebookIcon />,
    placeholder: "Your Facebook profile link",
  },
  {
    title: "google",
    icon: <YoutubeIcon />,
    placeholder: "Your Youtube profile link",
  },
  {
    title: "twitter",
    icon: <TwitterIcon />,
    placeholder: "Your Twitter profile link",
  },
  {
    title: "discord",
    icon: <DiscordIcon />,
    placeholder: "Your Discord profile link",
  },
];

const ProfilePageContainer = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const tron_wallet = getTronWallet();

  const user = useSelector((state: any) => state.user);

  const [form, setForm] = useState<any>({
    tron_token: "",
    person_name: "",
    user_description: "",
    twitter: "",
    facebook: "",
    google: "",
    discord: "",
    avatarlink: "",
  });

  const [isChanged, setIsChanged] = useState<boolean>(false);
  const [isNameExist, setIsNameExist] = useState<boolean>(false);
  const [isMouseOnAvatar, setIsMouseOnAvatar] = useState<boolean>(false);

  const [isSaved, setIsSaved] = useState<boolean>(false);

  const [isTronCopied, setIsTronCopied] = useState<boolean>(false);

  const copyTron = (wallet: string) => {
    navigator.clipboard.writeText(wallet);
    setIsTronCopied(true);
    setTimeout(() => setIsTronCopied(false), 3000);
  };

  const getUser = async (tron_token: string) => {
    const { data } = await axiosClient.get("/api/user/" + tron_wallet);
    if (data.person_name && data.person_name.length > 0) {
      setIsNameExist(true);
    }
    setForm({
      ...data,
      person_name: data.person_name,
      avatarlink: data.avatarlink,
    });
  };

  useEffect(() => {
    if (user.id) {
      getUser(getTronWallet());
    } else {
      navigate(routes.main);
    }
  }, [user]);

  const [file, setFile] = useState<any>();
  const [fileName, setFileName] = useState("");
  const [imagebase64, setImagebase84] = useState<any>("");

  const sendFile = async () => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("fileName", fileName);
    const res = await axiosClient.post(
      "/api/user/user/edit-image/" + tron_wallet,
      formData
    );
    if (res.status === 200) {
      return res;
    }
    //dispatch(tryToGetPersonInfo(pathname.slice(pathname.indexOf('@'))))
  };

  const saveProfile = async () => {
    await axiosClient.post("/api/user/user/edit/", {
      ...form,
      tron_token: tron_wallet,
    });
    if (imagebase64.length > 0) {
      sendFile();
    }
    setFileName("");
    setFile(null);
    setIsChanged(false);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
    getUser(getTronWallet());
    dispatch(tryToGetUser(getTronWallet()));
  };

  const deleteProfile = async () => {
    await axiosClient.post("/api/user/delete/", {
      user_id: user.id,
    });
    dispatch(setUser(""));
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
    if (ev.target.files[0].size <= 3 * 1024 * 1024) {
      setFile(ev.target.files[0]);
      fileToBase64(ev.target.files[0]);
      setIsChanged(true);
      setFileName(ev.target.files[0].name);
    }
  };

  return (
    <div className="profile-page">
      <PageTitle formatId="page_title_my_profile" />
      <div className="profile-page__main">
        <div className="profile-page__form">
          <div className="profile-page__form__items">
            {titles.map(({ title, Component }) => {
              let props = {};
              if (title.includes("socials"))
                props = {
                  socials,
                  form,
                  setIsChanged,
                  setForm,
                };
              if (title.includes("wallet"))
                props = {
                  copyTron,
                };
              if (title.includes("name"))
                props = {
                  isNameExist,
                  form,
                  setIsChanged,
                  setForm,
                };
              if (title.includes("username"))
                props = {
                  form,
                };
              if (title.includes("description"))
                props = {
                  form,
                  setForm,
                };
              return (
                <div className="profile-page__form__item">
                  <span key={title}>
                    <FormattedMessage id={title} />
                  </span>
                  {Boolean(Object.keys(props).length) ? (
                    <Component {...props} />
                  ) : (
                    <Component />
                  )}
                </div>
              );
            })}
          </div>
          {/* <div
            className="profile-page__form__info"
            style={{
              width:
                document.body.clientWidth > 640 ? "calc(50% - 12px)" : "65%",
            }}
          ></div> */}
          <div className="profile-page__buttons">
            <div className="profile-page__delete-button">
              <BlueButton
                formatId="profile_form_delete_button"
                padding="6px 30px"
                onClick={() => deleteProfile()}
                fontSize="18px"
              />
            </div>
            {(isChanged || fileName.length > 0) && (
              <div className="profile-page__save-button">
                <BlueButton
                  formatId="profile_form_save_button"
                  padding="6px 30px"
                  onClick={() => saveProfile()}
                  fontSize="18px"
                />
              </div>
            )}
          </div>
        </div>
        <div className="profile-page__file-input">
          <div className="profile-page__file-avatar">
            <span className="profile-page__file-input__title">
              <FormattedMessage id="profile_form_file_title" />
            </span>
            <span className="profile-page__file-input__subtitle">
              <FormattedMessage id="profile_form_file_subtitle" />
            </span>
            <div
              className="profile-page__file-input__row"
              onMouseEnter={() => setIsMouseOnAvatar(true)}
              onMouseLeave={() => setIsMouseOnAvatar(false)}
            >
              <div className="profile-page__file-input__row__image">
                {(imagebase64 && imagebase64.length > 0) ||
                (form.avatarlink && form.avatarlink.length > 0) ? (
                  <img
                    src={
                      imagebase64 &&
                      imagebase64.length &&
                      imagebase64.length > 0
                        ? imagebase64
                        : form.avatarlink.length > 0 && url + form.avatarlink
                    }
                    alt="avatar"
                  />
                ) : (
                  <LargeImageIcon />
                )}
              </div>
              <div className="profile-page__file-input__row__button">
                <input
                  type="file"
                  onChange={saveFile}
                  accept="image/jpeg,image/jpg,image/png"
                />
                <div
                  className="profile-page__file-input__row__back"
                  style={{
                    opacity: isMouseOnAvatar ? "1" : "0",
                  }}
                >
                  <UploadIcon />
                  <span>600x600px</span>
                </div>
              </div>
            </div>
          </div>
          <div className="profile-page__file-banner">
            <span className="profile-page__file-input__title">
              <FormattedMessage id="profile_form_banner_title" />
            </span>
            <span className="profile-page__file-input__subtitle">
              <FormattedMessage id="profile_info_background_title" />
            </span>
            <ProfileBanner saveBtn={false} isEditMode />
          </div>
        </div>
      </div>

      {/* Заменить на новые уведомления */}
      {/* <span
                className="save-message"
                style={{
                    opacity: isSaved ? '1' : '0'
                }}
            >
                Saved successfully
            </span>

            <span
                className="copy-message"
                style={{
                    opacity: isTronCopied ? '1' : '0'
                }}
            >
                Copied
            </span> */}
    </div>
  );
};

export default ProfilePageContainer;
