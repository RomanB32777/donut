import { FC } from "react";
import clsx from "clsx";

import HeaderComponent from "components/HeaderComponents/HeaderComponent";
import HeaderSelect from "components/HeaderComponents/HeaderSelect";
import NotificationsPopup from "components/HeaderComponents/NotificationsPopup";

interface IAdminHeader {
  collapsedSidebar: boolean;
  headerModificator?: string;
  headerStyles?: React.CSSProperties;
  setCollapsedSidebar: (state: boolean) => any;
}

const AdminHeader: FC<IAdminHeader> = ({
  collapsedSidebar,
  headerModificator,
  headerStyles,
  setCollapsedSidebar,
}) => (
  <HeaderComponent
    collapsedSidebar={collapsedSidebar}
    setCollapsedSidebar={setCollapsedSidebar}
    modificator={clsx("layout-header", headerModificator)}
    styles={headerStyles}
    visibleGamburger
  >
    <NotificationsPopup />
    <HeaderSelect />
  </HeaderComponent>
);

export default AdminHeader;
