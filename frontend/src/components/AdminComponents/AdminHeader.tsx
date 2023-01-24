import clsx from "clsx";
import { HeaderComponent } from "components/HeaderComponents/HeaderComponent";
import HeaderSelect from "components/HeaderComponents/HeaderSelect";
import NotificationsPopup from "components/HeaderComponents/NotificationsPopup";
import { useAppSelector } from "hooks/reduxHooks";

const Header = ({
  collapsedSidebar,
  headerModificator,
  setCollapsedSidebar,
}: {
  collapsedSidebar: boolean;
  headerModificator?: string;
  setCollapsedSidebar: (state: boolean) => any;
}) => {
  const { id, username } = useAppSelector(({ user }) => user);

  return (
    <HeaderComponent
      collapsedSidebar={collapsedSidebar}
      setCollapsedSidebar={setCollapsedSidebar}
      modificator={clsx("layout-header", headerModificator)}
      visibleGamburger
    >
      <>
        {id && <NotificationsPopup user={id} />}
        {username && <HeaderSelect title={username.slice(1)} />}
      </>
    </HeaderComponent>
  );
};

export default Header;
