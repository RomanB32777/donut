import { HeaderComponent } from "components/HeaderComponents/HeaderComponent";
import HeaderSelect from "components/HeaderComponents/HeaderSelect";
import NotificationsPopup from "components/HeaderComponents/NotificationsPopup";
import { useAppSelector } from "hooks/reduxHooks";

const Header = ({
  collapsedSidebar,
  isOpenHeaderSelect,
  hiddenLayoutElements,
  isNotificationPopupOpened,
  setCollapsedSidebar,
  closeAllHeaderPopups,
  setIsOpenHeaderSelect,
  setNotificationPopupOpened,
}: {
  hiddenLayoutElements: boolean;
  collapsedSidebar: boolean;
  isOpenHeaderSelect: boolean;
  isNotificationPopupOpened: boolean;
  setCollapsedSidebar: (state: boolean) => any;
  closeAllHeaderPopups: () => void;
  setIsOpenHeaderSelect: (state: boolean) => void;
  setNotificationPopupOpened: (state: boolean) => void;
}) => {
  const { id, username } = useAppSelector(({ user }) => user);

  const handlerHeaderSelect = (e?: React.MouseEvent<HTMLDivElement>) => {
    e && e.stopPropagation();
    setIsOpenHeaderSelect(!isOpenHeaderSelect);
    setNotificationPopupOpened(false);
  };

  const handlerNotificationPopup = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    setNotificationPopupOpened(!isNotificationPopupOpened);
    setIsOpenHeaderSelect(false);
  };

  return (
    <HeaderComponent
      hidden={hiddenLayoutElements}
      onClick={() => closeAllHeaderPopups()}
      collapsedSidebar={collapsedSidebar}
      setCollapsedSidebar={setCollapsedSidebar}
      modificator="layout-header"
      visibleGamburger
    >
      <>
        {id && (
          <NotificationsPopup
            user={id}
            handlerNotificationPopup={handlerNotificationPopup}
            isNotificationPopupOpened={isNotificationPopupOpened}
          />
        )}

        {username && (
          <HeaderSelect
            title={username}
            isOpenSelect={isOpenHeaderSelect}
            handlerHeaderSelect={handlerHeaderSelect}
          />
        )}
      </>
    </HeaderComponent>
  );
};

export default Header;
