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
  metamaskWalletIsIntall,
  tronWalletIsIntall,
} from "../../functions/getTronWallet";
import {
  DiscordIcon,
  FacebookIcon,
  InstagramIcon,
  LargeImageIcon,
  TronIcon,
  TwitchIcon,
  TwitterIcon,
  UploadIcon,
  YoutubeIcon,
} from "../../icons/icons";
import routes from "../../routes";
import { setUser, tryToGetUser } from "../../store/types/User";
import {
  addNotification,
  addSuccessNotification,
  checkIsExistUser,
} from "../../utils";

import ProfileBanner from "../../components/ProfileBanner";
import MetaMaskFox from "../../assets/MetaMask_Fox.png";
import TronlinkIcon from "../../assets/tronlink.png";

import "./styles.sass";
import {
  openAuthMetamaskModal,
  openAuthTronModal,
} from "../../store/types/Modal";

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
    onlyCreator: true,
    Component: ({
      form,
      setForm,
      setIsChanged,
    }: {
      form?: any;
      setForm?: any;
      setIsChanged?: any;
    }) => (
      // <span>{form.user_description}</span>
      <textarea
        value={form.user_description}
        placeholder="Tell us more about yourself"
        onChange={(event) => {
          setIsChanged(true);
          setForm({ ...form, user_description: event.target.value });
        }}
      />
    ),
  },
  {
    title: "profile_form_title_socials",
    onlyCreator: true,
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
    Component: ({
      copyToken,
      getUser,
    }: {
      copyToken?: (token: string) => void;
      getUser?: any;
    }) => {
      const [metaMaskWallet, setMetaMaskWallet] = useState<null | string>(null);
      const [tronWallet, setTronWallet] = useState<null | string>(null);
      const user = useSelector((state: any) => state.user);
      const dispatch = useDispatch();

      const getMetaWallet = async () => {
        user.metamask_token && setMetaMaskWallet(user.metamask_token);
        user.tron_token && setTronWallet(user.tron_token);

        // if (metamaskWalletIsIntall()) {
        //   const walletMeta = await getMetamaskWallet();
        //   if (walletMeta) {
        //     setMetaMaskWallet(walletMeta);
        //     const isExistUser = await checkIsExistUser(walletMeta);
        //     if (!isExistUser)
        //       await axiosClient.post(`api/user/edit-token/${user.user_id}`, {
        //         type_wallet: "metamask",
        //         token: walletMeta,
        //       });
        //   }
        // }

        // if (tronWalletIsIntall()) {
        //   const walletTron = getTronWallet();
        //   if (walletTron) {
        //     setTronWallet(walletTron);
        //     const isExistUser = await checkIsExistUser(walletTron);
        //     if (!isExistUser)
        //       await axiosClient.post(`api/user/edit-token/${user.user_id}`, {
        //         type_wallet: "tron",
        //         token: walletTron,
        //       });
        //   }
        // }
      };

      useEffect(() => {
        getMetaWallet();
      }, [user]);

      const registrationWalletClick = async (walletType: string) => {
        if (walletType === "metamask") {
          if (metamaskWalletIsIntall()) {
            const metamaskWallet = await getMetamaskWallet();
            if (metamaskWallet) {
              const isExistUser = await checkIsExistUser(metamaskWallet);
              console.log(isExistUser);
              
              if (!isExistUser) {
                await axiosClient.post(`api/user/edit-token/${user.user_id}`, {
                  type_wallet: "metamask",
                  token: metamaskWallet,
                });
                getUser && getUser(getTronWallet());
                dispatch(tryToGetUser(getTronWallet()));
              } else {
                addNotification({
                  type: "warning",
                  title: `The token is already in use by another user`,
                  message: `The token (${metamaskWallet}) is already in use by another user. Please select another ${walletType} account`,
                });
              }
            }
          } else {
            dispatch(openAuthMetamaskModal());
          }
        } else {
          if (tronWalletIsIntall()) {
            const wallet = getTronWallet();
            if (wallet) {
              const isExistUser = await checkIsExistUser(wallet);
              if (!isExistUser) {
                await axiosClient.post(`api/user/edit-token/${user.user_id}`, {
                  type_wallet: "tron",
                  token: wallet,
                });
                const metaWallet = await getMetamaskWallet();
                getUser && getUser(metaWallet);
                dispatch(tryToGetUser(metaWallet));
              } else {
                addNotification({
                  type: "warning",
                  title: `The token is already in use by another user`,
                  message: `The token (${wallet}) is already in use by another user. Please select another ${walletType} account`,
                });
              }
            }
          } else {
            dispatch(openAuthTronModal());
          }
        }
      };

      return (
        <div>
          {tronWalletIsIntall() && user.tron_token ? (
            <span
              onClick={() => copyToken && tronWallet && copyToken(tronWallet)}
            >
              <div className="wallet_row">
                <img src={TronlinkIcon} alt="TronlinkIcon" />
                <span>
                  {tronWallet && tronWallet.length > 20
                    ? tronWallet.slice(0, 6) +
                      "..." +
                      tronWallet.slice(tronWallet.length - 24)
                    : "mytoken"}
                </span>
              </div>
            </span>
          ) : (
            <div
              className="wallet_connect"
              onClick={() => registrationWalletClick("tronlink")}
            >
              <span>Connect TronLink</span>
              <img src={TronlinkIcon} alt="TronlinkIcon" />
            </div>
          )}
          {metamaskWalletIsIntall() && user.metamask_token ? (
            <span
              onClick={() =>
                copyToken && metaMaskWallet && copyToken(metaMaskWallet)
              }
            >
              <div className="wallet_row">
                <img src={MetaMaskFox} alt="MetaMaskFox" />
                <span>
                  {metaMaskWallet && metaMaskWallet.length > 30
                    ? metaMaskWallet.slice(0, 6) +
                      "..." +
                      metaMaskWallet.slice(metaMaskWallet.length - 26)
                    : "mytoken"}
                </span>
              </div>
            </span>
          ) : (
            <div
              className="wallet_connect"
              onClick={() => registrationWalletClick("metamask")}
            >
              <span>Connect Metamask</span>
              <img src={MetaMaskFox} alt="MetaMaskFox" />
            </div>
          )}
        </div>
      );
    },
  },
];

const socials = [
  {
    title: "google",
    icon: <YoutubeIcon />,
    placeholder: "Your Youtube profile link",
  },
  {
    title: "twitch",
    icon: <TwitchIcon />,
    placeholder: "Your Twitch profile link",
  },
  {
    title: "instagram",
    icon: <InstagramIcon />,
    placeholder: "Your Instagram profile link",
  },
  {
    title: "facebook",
    icon: <FacebookIcon />,
    placeholder: "Your Facebook profile link",
  },
  {
    title: "twitter",
    icon: <TwitterIcon />,
    placeholder: "Your Twitter profile link",
  },
];

const ProfilePageContainer = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = useSelector((state: any) => state.user);

  const [form, setForm] = useState<any>({
    // tron_token: "",
    person_name: "",
    username: "",
    user_description: "",
    twitter: "",
    facebook: "",
    google: "",
    instagram: "",
    twitch: "",
    avatarlink: "",
    backgroundlink: "",
  });

  const [isChanged, setIsChanged] = useState<boolean>(false);
  const [isNameExist, setIsNameExist] = useState<boolean>(false);
  const [isMouseOnAvatar, setIsMouseOnAvatar] = useState<boolean>(false);

  const copyToken = (wallet: string) => {
    navigator.clipboard.writeText(wallet);
    addNotification({ type: "success", title: "Token successfully copied" });
  };

  const getUser = async (token: string) => {
    const { data } = await axiosClient.get("/api/user/" + token);

    if (data.person_name && data.person_name.length > 0) {
      setIsNameExist(true);
    }

    console.log(data);
    

    setForm({
      ...data,
      user_description: data.user_description,
      username: data.username,
      person_name: data.person_name,
      avatarlink: data.avatarlink,
      backgroundlink: data.backgroundlink,
    });
  };

  const getUserByToken = async () => {
    let token = user.tron_token || user.metamask_token
    if (!token) {
      if (tronWalletIsIntall())
        token = getTronWallet()

      if (!token && metamaskWalletIsIntall())
        token =  await getMetamaskWallet()
    }
    getUser(token);
  };

  useEffect(() => {
    if (user.id) {
      getUserByToken();
    } else {
      navigate(routes.main);
    }
  }, [user]);

  const [file, setFile] = useState<any>();
  const [fileName, setFileName] = useState("");
  const [imagebase64, setImagebase84] = useState<any>("");
  const [sendBannerFile, setSendBannerFile] = useState<any>(false);

  const sendAvatarFile = async () => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("fileName", fileName);
    if (user && user.id) {
      const res = await axiosClient.post(
        "/api/user/user/edit-image/" + user.id,
        formData
      );
      if (res.status === 200) {
        return res;
      }
    }
    //dispatch(tryToGetPersonInfo(pathname.slice(pathname.indexOf('@'))))
  };

  const saveProfile = async () => {
    try {
      await axiosClient.post("/api/user/user/edit/", {
        ...form,
        user_id: user.id,
      });
      if (imagebase64.length > 0) {
        sendAvatarFile();
      }
      setSendBannerFile(true);
      setFileName("");
      setFile(null);
      setIsChanged(false);

      getUser(user.tron_token || user.metamask_token);
      dispatch(tryToGetUser(user.tron_token || user.metamask_token));

      addSuccessNotification("Data saved successfully");
    } catch (error) {
      addNotification({
        type: "danger",
        title: "Error",
        message: `An error occurred while saving data`,
      });
    }
  };

  const deleteProfile = async () => {
    await axiosClient.post("/api/user/delete/", {
      user_id: user.id,
    });
    dispatch(setUser(""));
    sessionStorage.removeItem('main_wallet');
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
            {titles
              .filter(
                (t) =>
                  (t.onlyCreator && user.roleplay === "creators") ||
                  !t.onlyCreator
              )
              .map(({ title, Component }) => {
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
                    copyToken,
                    getUser,
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
                    setIsChanged,
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
                {
                  ((imagebase64 && imagebase64.length > 0) ||
                    (form.avatarlink && form.avatarlink.length > 0)) && (
                    <img
                      src={imagebase64 || url + form.avatarlink}
                      alt="avatar"
                    />
                  )
                  // : (
                  //   <LargeImageIcon />
                  // )
                }
                {/* {(imagebase64 && imagebase64.length > 0) || (form.avatarlink && form.avatarlink.length > 0)} */}
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
          {user.roleplay === "creators" && (
            <div className="profile-page__file-banner">
              <span className="profile-page__file-input__title">
                <FormattedMessage id="profile_form_banner_title" />
              </span>
              <span className="profile-page__file-input__subtitle">
                <FormattedMessage id="profile_info_background_title" />
              </span>
              <ProfileBanner
                saveBtn={false}
                isEditMode
                sendBannerFile={sendBannerFile}
                imgLink={form.backgroundlink}
                setIsChanged={setIsChanged}
              />
            </div>
          )}
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
