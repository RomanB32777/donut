import { useEffect, useState } from "react";
import { FormattedMessage } from "react-intl";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import BlueButton from "../../commonComponents/BlueButton";
import PageTitle from "../../commonComponents/PageTitle";
import { url } from "../../consts";
import { LargeImageIcon } from "../../icons/icons";
import routes from "../../routes";
import "./styles.sass";

const FollowsContainer = () => {
  const [data, setData] = useState<any[]>([
    // {
    //     username: '@mikki',
    //     avatarlink: '',
    //     user_description: 'Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum'
    // },
    // {
    //     username: '@mikki',
    //     avatarlink: '',
    //     user_description: 'Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum'
    // },
    // {
    //     username: '@mikki',
    //     avatarlink: '',
    //     user_description: 'Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum'
    // },
    // {
    //     username: '@mikki',
    //     avatarlink: '',
    //     user_description: 'Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum'
    // },
    // {
    //     username: '@mikki',
    //     avatarlink: '',
    //     user_description: 'Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum'
    // },
    // {
    //     username: '@mikki',
    //     avatarlink: '',
    //     user_description: 'Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum'
    // },
  ]);

  const navigate = useNavigate();

  const user = useSelector((state: any) => state.user);

  const getData = async () => {
    if (user && user.username && user.username.length > 0) {
      const res = await fetch(
          "/api/user/get-follows/" + user.username
      );
      if (res.status === 200) {
        const result = await res.json();
        setData(result);
      }
    }
  };

  useEffect(() => {
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="follows-container">
      <PageTitle formatId="page_title_following" />
      <div className="follows-container__list">
        {data && data.length > 0 ? (
          data.map((follow, followIndex) => (
            <div
              className="creators-list-container__list__panel"
              style={{
                marginLeft: followIndex % 2 === 1 ? "90px" : "0px",
              }}
              onClick={() => navigate("/creator/" + follow.username)}
            >
              <div className="creators-list-container__list__panel__image">
                {follow.avatarlink && follow.avatarlink.length > 0 ? (
                  <img src={url + follow.avatarlink} />
                ) : (
                  <div>
                    <LargeImageIcon />
                  </div>
                )}
              </div>

              <div className="creators-list-container__list__panel__info">
                <span className="username">{follow.username}</span>
                <span className="desc">{follow.user_description}</span>
              </div>
            </div>
          ))
        ) : (
          <div className="follows-container__list__message">
            <span className="title">
              <FormattedMessage id="follows_page_message_title" />
            </span>
            <BlueButton
              formatId="follows_page_button"
              onClick={() => navigate(routes.creators)}
              padding="12px 44px"
              fontSize="21px"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default FollowsContainer;
