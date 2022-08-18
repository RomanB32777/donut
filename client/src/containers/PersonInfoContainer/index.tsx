import { useContext, useEffect, useMemo, useState } from "react";
import { FormattedMessage } from "react-intl";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router";

import BlueButton from "../../commonComponents/BlueButton";
import LinksPanel from "../../components/PersonInfoComponents/LinksPanel";
import NavigatingPanel from "../../components/PersonInfoComponents/NavigatingPanel";
import PersonMainInfo from "../../components/PersonInfoComponents/PersonMainInfo";
import { url } from "../../consts";
import { openSupportModal } from "../../store/types/Modal";
import { tryToGetPersonInfo } from "../../store/types/PersonInfo";

import Space from "../../space.png";

import "./styles.sass";
import getTronWallet from "../../functions/getTronWallet";
import axiosClient from "../../axiosClient";
import { PencilIcon, UploadIcon } from "../../icons/icons";
import { tryToGetUser } from "../../store/types/User";
import { addAuthNotification } from "../../utils";
import { WebSocketContext } from "../../components/Websocket/WebSocket";
import routes from "../../routes";

const PersonInfoContainer = () => {
  const dispatch = useDispatch();
  const socket = useContext(WebSocketContext);
  const navigate = useNavigate()

  const data = useSelector((state: any) => state.personInfo).main_info;
  const backer = useSelector((state: any) => state.user);
  const { isLoading } = useSelector((state: any) => state.loading);

  const tron_token = getTronWallet();

  const { pathname } = useLocation();

  useEffect(() => {
    if (backer && backer.id) {
      dispatch(
        tryToGetPersonInfo({
          username: pathname.slice(pathname.indexOf("@")),
          id: backer.id,
        })
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [backer]);

  const isEditMode: boolean = tron_token === data.tron_token;

  const [file, setFile] = useState<any>();
  const [fileName, setFileName] = useState("");
  const [imagebase64, setImagebase84] = useState<any>("");
  const [description, setDescription] = useState(data.user_description);
  const [descriptionChanged, setDescriptionChanged] = useState<boolean>(false);

  const [isMouseOnBackground, setIsMouseOnBackground] =
    useState<boolean>(false);
  const [isMouseOnDescription, setIsMouseOnDescription] =
    useState<boolean>(false);

  const isFollowing = useMemo(() => {
    return (
      backer &&
      backer.subscriptions &&
      backer.subscriptions.some(
        (person: any) => person.user_id === data.user_id
      )
    );
  }, [backer, data]);

  const followClick = async () => {
    if (tron_token) {
      try {
        if (!isFollowing) {
          axiosClient
            .post("/api/user/follow", {
              backer_id: backer.id,
              backer_username: backer.username,
              creator_id: data.user_id,
              creator_username: data.username,
            })
            .then((res) => {
              if (res.status === 200) {
                socket &&
                  backer &&
                  data &&
                  socket.emit("new_following", {
                    follower: { username: backer.username, id: backer.user_id },
                    creator_id: data.user_id,
                    followID: res.data.follow.id,
                  });
                dispatch(
                  tryToGetPersonInfo({
                    id: data.user_id,
                    username: pathname.slice(pathname.indexOf("@")),
                  })
                );
                dispatch(tryToGetUser(tron_token));
              }
            });
        } else if (isFollowing) {
          const follow =
            backer.subscriptions &&
            backer.subscriptions.find(
              (person: any) => person.user_id === data.user_id
            );
          if (follow && follow.id) {
            axiosClient
              .post("/api/user/unfollow", { id: follow.id })
              .then((res) => {
                if (res.status === 200) {
                  dispatch(tryToGetUser(tron_token));
                }
              });
          }
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      addAuthNotification();
    }
  };

  const sendFile = () => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("fileName", fileName);
    axiosClient.post("/api/user/user/edit-background/" + data.user_id, formData);
    setFileName("");
    setFile("");
    setImagebase84("");
    dispatch(
      tryToGetPersonInfo({ username: pathname.slice(pathname.indexOf("@")) })
    );
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

  const submitDescription = () => {
    axiosClient
      .post("/api/user/user/edit-description/", {
        user_id: backer.id,
        description: description,
      })
      .then((res) => {
        if (res) {
          setDescriptionChanged(false);
          dispatch(
            tryToGetPersonInfo({
              username: pathname.slice(pathname.indexOf("@")),
            })
          );
        }
      });
  };

  return (
    <div className="person-info-container">
      <div
        className="person-info-container__background"
        onMouseEnter={() => setIsMouseOnBackground(true)}
        onMouseLeave={() => setIsMouseOnBackground(false)}
      >
        <img
          src={
            fileName.length > 0
              ? imagebase64 || ""
              : data.backgroundlink && data.backgroundlink.length > 0
              ? `${url + data.backgroundlink}`
              : Space
          }
          alt="banner"
        />
        {isEditMode && <input type="file" onChange={saveFile} />}

        <div
          className="person-info-container__background__save"
          style={{
            opacity: fileName.length > 0 ? "1" : "0",
          }}
          onClick={() => {
            if (isEditMode) {
              sendFile();
            }
          }}
        >
          Save
        </div>
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

      <div className="person-info-container__information-wrapper">
        <div className="person-info-container__information-wrapper__information">
          <PersonMainInfo />

          <div className="person-info-container__information-wrapper__information__description">
            {isEditMode ? (
              <textarea
                placeholder="There can be description"
                value={descriptionChanged ? description : data.user_description}
                onChange={(event) => {
                  setDescriptionChanged(true);
                  setDescription(event.target.value);
                }}
                onFocus={() => setIsMouseOnDescription(false)}
                onMouseEnter={() => setIsMouseOnDescription(true)}
                onMouseLeave={() => setIsMouseOnDescription(false)}
              ></textarea>
            ) : (
              <>
                {data.user_description && data.user_description.length > 0 ? (
                  data.user_description
                ) : (
                  <>There can be description</>
                )}
              </>
            )}
            <div
              className="dark"
              style={{
                opacity: isEditMode && isMouseOnDescription ? "1" : "0",
              }}
            >
              <PencilIcon />
            </div>
            {descriptionChanged && isEditMode && (
              <div
                className="person-info-container__information-wrapper__information__description__button"
                onClick={() => submitDescription()}
              >
                Save
              </div>
            )}
          </div>

          <NavigatingPanel />

          <LinksPanel
            twitter={data.twitter}
            facebook={data.facebook}
            youtube={data.google}
            discord={data.discord}
          />

          <div className="person-info-container__information-wrapper__information__buttons">
            {isEditMode || backer.roleplay === "creators" ? (
              <></>
            ) : (
              <>
                <div
                  className={`
                  black-button 
                  ${isLoading ? "button-loading" : ""}
                  `}
                  onClick={followClick}
                >
                  {data && isFollowing ? (
                    <FormattedMessage id="profile_info_following" />
                  ) : (
                    <FormattedMessage id="profile_info_follow_button" />
                  )}
                </div>
                <BlueButton
                  formatId="profile_info_support_button"
                  fontSize="18px"
                  padding="6px 30px"
                  onClick={() => {
                    navigate(`/donat/${data.username}`)
                    // tron_token
                    //   ? dispatch(openSupportModal())
                    //   : addAuthNotification();
                  }}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonInfoContainer;
