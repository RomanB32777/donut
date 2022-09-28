import clsx from "clsx";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { url } from "../../../consts";
import { LogoutIcon, SmallToggleListArrowIcon } from "../../../icons/icons";
import { setUser } from "../../../store/types/User";
import { setMainWallet } from "../../../store/types/Wallet";
import "./styles.sass";

const HeaderSelect = ({
  title,
  isOpenSelect,
  isNotVisibleAvatarInMobile,
  handlerHeaderSelect,
}: {
  title: string;
  isOpenSelect?: boolean;
  isNotVisibleAvatarInMobile?: boolean;
  handlerHeaderSelect?: (e?: React.MouseEvent<HTMLDivElement>) => void;
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state: any) => state.user);

  return (
    <div className="header-select">
      {user.id && (
        <div
          className={clsx("header-select__image", {
            dNone: isNotVisibleAvatarInMobile,
          })}
          onClick={() => navigate("/settings")}
        >
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
                dispatch(setMainWallet({}));
                navigate("/landing");
              }}
            >
              <div className="header-select__info-item__img icon">
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
