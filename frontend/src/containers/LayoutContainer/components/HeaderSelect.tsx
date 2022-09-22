import clsx from "clsx";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { url } from "../../../consts";
import { LogoutIcon, SmallToggleListArrowIcon } from "../../../icons/icons";
import { setUser } from "../../../store/types/User";

const HeaderSelect = ({
  title,
  isOpenSelect,
  handlerHeaderSelect,
}: {
  title: string;
  isOpenSelect?: boolean;
  handlerHeaderSelect?: (e?: React.MouseEvent<HTMLDivElement>) => void;
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state: any) => state.user);

  return (
    <div className="header-select">
      {user.id && (
        <div className="header-select__image" onClick={() => navigate("/settings")}>
          {user.avatarlink && <img src={url + user.avatarlink} alt="" />}
        </div>
      )}
      <div
        className={clsx("header-select__info", {
          withoutArrow: isOpenSelect === undefined,
        })}
        onClick={(e: React.MouseEvent<HTMLDivElement>) =>
          handlerHeaderSelect && handlerHeaderSelect(e)
        }
      >
        <span className="header-select__info__name">{title}</span>
        {isOpenSelect !== undefined && (
          <div
            className={clsx("icon", "header-select__info__icon", {
              rotated: isOpenSelect,
            })}
          >
            <SmallToggleListArrowIcon />
          </div>
        )}
      </div>
      {isOpenSelect && (
        <div className="header-select__info-popup">
          <div className="header-select__info-item">
            <div
              className="header-select__info-item__content"
              onClick={(e: React.MouseEvent<HTMLDivElement>) => {
                handlerHeaderSelect && handlerHeaderSelect(e);
                dispatch(setUser(""));
                localStorage.removeItem("main_wallet");
                navigate("/");
              }}
            >
              <div className="header-select__info-item__img">
                <LogoutIcon />
              </div>
              <span className="header-select__info-item__name">Sign-out</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HeaderSelect;
