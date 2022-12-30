import { Col, Row } from "antd";
import { Header } from "antd/lib/layout/layout";
import clsx from "clsx";
import { useSelector } from "react-redux";
import { useAppSelector } from "../../../hooks/reduxHooks";
import { MenuMobileIcon } from "../../../icons";
import { shortStr } from "../../../utils";
import BaseButton from "../../BaseButton";
import HeaderSelect from "../HeaderSelect";
import Logo from "../LogoComponent";
import "./styles.sass";

interface IHeaderComponent {
  visibleLogo?: boolean;
  logoUrl?: string;
  visibleGamburger?: boolean;
  hidden?: boolean;
  contentModificator?: string;
  modificator?: string;
  backgroundColor?: string;
  collapsedSidebar?: boolean;
  children?: React.ReactNode;
  setCollapsedSidebar?: (status: boolean) => void;
  onClick?: () => void;
}

export const HeaderComponent = ({
  hidden,
  visibleLogo,
  visibleGamburger,
  logoUrl,
  contentModificator,
  modificator,
  backgroundColor,
  collapsedSidebar,
  children,
  setCollapsedSidebar,
  onClick,
}: IHeaderComponent) => {
  // const { user } = useAppSelector((state) => state);
  // const { username } = user;

  return (
    <Header
      className={clsx("site-layout-background", {
        [modificator as string]: modificator,
      })}
      hidden={hidden}
      onClick={onClick}
      style={{
        background: backgroundColor,
      }}
    >
      <Row
        justify="space-between"
        align="middle"
        className={clsx("header-container", {
          [contentModificator as string]: contentModificator,
        })}
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
          <Col lg={8} xs={14}>
            <div className="header__left">
              <Logo navigateUrl={logoUrl || "/"} />
            </div>
          </Col>
        )}
        <Col xs={!visibleLogo ? 24 : 8}>
          <div className="header__right">
            {children}
            {/* {(username || blockchain) && */}
          </div>
        </Col>
      </Row>
    </Header>
  );
};
