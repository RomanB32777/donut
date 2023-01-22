import { useRef, useState } from "react";
import clsx from "clsx";
import { useNavigate } from "react-router";
import { useDispatch } from "react-redux";

import WalletBlock from "components/HeaderComponents/WalletBlock";
import { LogoutIcon, SmallToggleListArrowIcon } from "icons";

import { useAppSelector } from "hooks/reduxHooks";
import useWindowDimensions from "hooks/useWindowDimensions";
import useOnClickOutside from "hooks/useClickOutside";
import { logoutUser } from "utils";
import "./styles.sass";

const HeaderSelect = ({
  title,
  isNotVisibleAvatarInMobile,
}: {
  title: string;
  isNotVisibleAvatarInMobile?: boolean;
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id, avatar } = useAppSelector(({ user }) => user);
  const { isMobile } = useWindowDimensions();
  const blockRef = useRef(null);

  const [isOpenSelect, setIsOpenSelect] = useState(false);

  const handlerSelect = () => setIsOpenSelect((prev) => !prev);

  const logout = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsOpenSelect && setIsOpenSelect(false);
    logoutUser({ dispatch, navigate });
  };

  useOnClickOutside(isOpenSelect, blockRef, handlerSelect);

  return (
    <div ref={blockRef} className="header-select">
      {!isMobile && <WalletBlock />}
      <div
        className={clsx("info", {
          withoutArrow: isOpenSelect === undefined,
          withWalletBlock: !isMobile,
        })}
        onClick={handlerSelect}
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
