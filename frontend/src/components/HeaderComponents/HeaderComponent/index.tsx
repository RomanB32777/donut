import { Col, Row } from "antd";
import { Header } from "antd/lib/layout/layout";
import clsx from "clsx";

import { MenuMobileIcon } from "icons";
import Logo from "components/HeaderComponents/LogoComponent";
import "./styles.sass";

interface IHeaderComponent {
  visibleLogo?: boolean;
  logoUrl?: string;
  visibleGamburger?: boolean;
  hidden?: boolean;
  contentModificator?: string;
  modificator?: string;
  styles?: React.CSSProperties;
  backgroundColor?: string;
  collapsedSidebar?: boolean;
  children?: React.ReactNode;
  setCollapsedSidebar?: (status: boolean) => void;
  onClick?: () => void;
}

const HeaderComponent = ({
  hidden,
  visibleLogo,
  visibleGamburger,
  logoUrl,
  contentModificator,
  modificator,
  styles,
  backgroundColor,
  collapsedSidebar,
  children,
  setCollapsedSidebar,
  onClick,
}: IHeaderComponent) => {
  return (
    <Header
      className={clsx("site-layout-background", modificator)}
      hidden={hidden}
      onClick={onClick}
      style={{
        background: backgroundColor,
        ...styles,
      }}
    >
      <Row
        justify="space-between"
        align="middle"
        className={clsx("header-container", contentModificator)}
      >
        {visibleGamburger && (
          <div
            className={clsx("gamb-icon", {
              active: !collapsedSidebar,
            })}
            onClick={() =>
              setCollapsedSidebar && setCollapsedSidebar(!collapsedSidebar)
            }
          >
            <MenuMobileIcon />
          </div>
        )}
        {visibleLogo && (
          <Col xs={8}>
            <div className="header__left">
              <Logo navigateUrl={logoUrl || "/"} />
            </div>
          </Col>
        )}
        <Col xs={!visibleLogo ? 24 : 14}>
          <div className="header__right">{children}</div>
        </Col>
      </Row>
    </Header>
  );
};

export default HeaderComponent;
