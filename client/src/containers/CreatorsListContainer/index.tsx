import axiosClient from "../../axiosClient";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import PageTitle from "../../commonComponents/PageTitle";
import { url } from "../../consts";
import { LargeImageIcon, SearchLoupeIcon } from "../../icons/icons";
import routes from "../../routes";
import "./styles.sass";

const CreatorsListContainer = () => {
  const navigate = useNavigate();

  const [search, setSearch] = useState<string>("");
  const [usersList, setUsersList] = useState<any[]>([]);

  const getUsers = async (name: string) => {
    const res = await fetch(  `/api/user/users/${name}`);
    const result = await res.json();
    setUsersList(result);
  };

  useEffect(() => {
    getUsers("all");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="creators-list-container">
      <PageTitle formatId="page_title_creators" />
      <div className="creators-list-container__search">
        <SearchLoupeIcon />
        <input
          type="text"
          onChange={(event) => {
            setSearch(event.target.value);
            if (event.target.value.length > 3) {
              getUsers(event.target.value);
            } else if (event.target.value.length === 0) {
              getUsers("all");
            }
          }}
        />
      </div>

      <div className="creators-list-container__list">
        {usersList.length === 0 ? (
          <span className="creators-list-container__list__not-found">
            Unfortunately, there is no results matching your search: {search}
          </span>
        ) : (
          usersList.map((user, userIndex) => (
            <div
              className="creators-list-container__list__panel"
              style={{
                marginLeft: userIndex % 2 === 1 ? "90px" : "0px",
              }}
              onClick={() => navigate("/creator/" + user.username)}
            >
              <div className="creators-list-container__list__panel__image">
                {user.avatarlink && user.avatarlink.length > 0 ? (
                  <img src={url + user.avatarlink} />
                ) : (
                  <div>
                    <LargeImageIcon />
                  </div>
                )}
              </div>

              <div className="creators-list-container__list__panel__info">
                <span className="username">{user.username}</span>
                <span className="desc">{user.user_description}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CreatorsListContainer;
