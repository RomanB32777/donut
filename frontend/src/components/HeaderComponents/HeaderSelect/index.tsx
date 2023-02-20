import { memo, useRef, useState } from "react";
import clsx from "clsx";

import WalletBlock from "components/HeaderComponents/WalletBlock";
import { LogoutIcon, SmallToggleListArrowIcon } from "icons";

import { useAppSelector } from "hooks/reduxHooks";
import useWindowDimensions from "hooks/useWindowDimensions";
import useOnClickOutside from "hooks/useClickOutside";
import { useLogoutUser } from "hooks/userHooks";
import "./styles.sass";

const HeaderSelect = ({
  title,
  isNotVisibleAvatarInMobile,
}: {
  title?: string;
  isNotVisibleAvatarInMobile?: boolean;
}) => {
  const { id, avatar, username } = useAppSelector(({ user }) => user);
  const { isMobile } = useWindowDimensions();
  const blockRef = useRef(null);
  const logout = useLogoutUser();

  const [isOpenSelect, setIsOpenSelect] = useState(false);

  const handlerSelect = () => setIsOpenSelect((prev) => !prev);

  const logoutHandler = () => {
    setIsOpenSelect && setIsOpenSelect(false);
    logout();
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
        <span className="title">{username.slice(1) || title}</span>
        <div
          className={clsx("icon", {
            rotated: isOpenSelect,
          })}
        >
          <SmallToggleListArrowIcon />
        </div>
        {Boolean(isOpenSelect) && (
          <div className="popup fadeIn">
            <div className="item">
              <div className="content" onClick={logoutHandler}>
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
