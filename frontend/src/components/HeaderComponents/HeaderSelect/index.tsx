import clsx from "clsx";
import { useNavigate } from "react-router";
import { useAppDispatch, useAppSelector } from "../../../hooks/reduxHooks";
import WalletBlock from "../WalletBlock";
import { LogoutIcon, SmallToggleListArrowIcon } from "../../../icons";
import { setUser } from "../../../store/types/User";
import { setSelectedBlockchain } from "../../../store/types/Wallet";
import "./styles.sass";
import useWindowDimensions from "../../../hooks/useWindowDimensions";

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
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { id, avatar } = useAppSelector(({ user }) => user);
  const { isMobile } = useWindowDimensions();

  return (
    <div className="header-select">
      {!isMobile && <WalletBlock />}
      <div
        className={clsx("info", {
          withoutArrow: isOpenSelect === undefined,
          withWalletBlock: !isMobile
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
        {isOpenSelect !== undefined && (
          <div
            className={clsx("icon", {
              rotated: isOpenSelect,
            })}
          >
            <SmallToggleListArrowIcon />
          </div>
        )}
        {Boolean(isOpenSelect) && (
          <div className="popup">
            {isMobile && (
              <div className="item">
                <WalletBlock />
              </div>
            )}
            <div className="item">
              <div
                className="content"
                onClick={(e: React.MouseEvent<HTMLDivElement>) => {
                  handlerHeaderSelect && handlerHeaderSelect(e);
                  dispatch(setUser(""));
                  localStorage.removeItem("main_blockchain");
                  dispatch(setSelectedBlockchain(""));
                  navigate("/");
                }}
              >
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
