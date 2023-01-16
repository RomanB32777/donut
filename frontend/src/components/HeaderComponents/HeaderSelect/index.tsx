import clsx from "clsx";
import { useNavigate } from "react-router";
import { useDispatch } from "react-redux";

import WalletBlock from "components/HeaderComponents/WalletBlock";
import { LogoutIcon, SmallToggleListArrowIcon } from "icons";

import { useAppSelector } from "hooks/reduxHooks";
import useWindowDimensions from "hooks/useWindowDimensions";
import { logoutUser } from "utils";
import "./styles.sass";

const HeaderSelect = ({
  title,
  isOpenSelect,
  isNotVisibleAvatarInMobile,
  handlerHeaderSelect,
}: {
  title: string;
  isOpenSelect: boolean;
  isNotVisibleAvatarInMobile?: boolean;
  handlerHeaderSelect?: (e?: React.MouseEvent<HTMLDivElement>) => void;
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id, avatar } = useAppSelector(({ user }) => user);
  const { isMobile } = useWindowDimensions();

  const logout = (e: React.MouseEvent<HTMLDivElement>) => {
    handlerHeaderSelect && handlerHeaderSelect(e);
    logoutUser({ dispatch, navigate });
  };

  return (
    <div className="header-select">
      {!isMobile && <WalletBlock />}
      <div
        className={clsx("info", {
          withoutArrow: isOpenSelect === undefined,
          withWalletBlock: !isMobile,
        })}
        onClick={(e: React.MouseEvent<HTMLDivElement>) =>
          handlerHeaderSelect && handlerHeaderSelect(e)
        }
      >
        {Boolean(id) && (
          <div
            className={clsx("image", {
              dNone: isNotVisibleAvatarInMobile,
            })}
          >
            {avatar && <img src={avatar} alt="avatar" />}
          </div>
        )}
        <span className="title">{title}</span>
        <div
          className={clsx("icon", {
            rotated: isOpenSelect,
          })}
        >
          <SmallToggleListArrowIcon />
        </div>
        {Boolean(isOpenSelect) && (
          <div className="popup">
            <div className="item">
              <div className="content" onClick={logout}>
                <div className="img icon">
                  <LogoutIcon />
                </div>
                <span className="name">Sign-out</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HeaderSelect;
