import { useRef, useState } from "react";
import { FormattedMessage } from "react-intl";
import clsx from "clsx";

import WalletBlock from "components/HeaderComponents/WalletBlock";
import LocalesSwitcher from "../LocalesSwitcher";
import { LogoutIcon, SmallToggleListArrowIcon } from "icons";

import { useAppSelector } from "hooks/reduxHooks";
import useWindowDimensions from "hooks/useWindowDimensions";
import useOnClickOutside from "hooks/useClickOutside";
import useAuth from "hooks/useAuth";
import "./styles.sass";

const HeaderSelect = ({
  title,
  isNotVisibleAvatarInMobile,
}: {
  title?: string;
  isNotVisibleAvatarInMobile?: boolean;
}) => {
  const { id, avatarLink, username, roleplay } = useAppSelector(
    ({ user }) => user
  );
  const { isMobile } = useWindowDimensions();
  const blockRef = useRef(null);
  const { logout } = useAuth();

  const [isOpenSelect, setIsOpenSelect] = useState(false);

  const isSupporter = roleplay === "backers";

  const handlerSelect = () => setIsOpenSelect((prev) => !prev);

  const logoutHandler = () => {
    setIsOpenSelect && setIsOpenSelect(false);
    logout();
  };

  useOnClickOutside(isOpenSelect, blockRef, handlerSelect);

  return (
    <div ref={blockRef} className="header-select">
      {isSupporter && !isMobile && <WalletBlock />}
      <LocalesSwitcher />
      <div
        className={clsx("info", {
          withoutArrow: isOpenSelect === undefined,
        })}
        onClick={handlerSelect}
      >
        {Boolean(id) && (
          <div
            className={clsx("image", {
              dNone: isNotVisibleAvatarInMobile,
            })}
          >
            {avatarLink && <img src={avatarLink} alt="avatar" />}
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
                <span className="name">
                  <FormattedMessage id="sign_out_button" />
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HeaderSelect;
