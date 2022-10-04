import { Col, Row } from "antd";
import { Header } from "antd/lib/layout/layout";
import clsx from "clsx";
import { useSelector } from "react-redux";
import useWindowDimensions from "../../../hooks/useWindowDimensions";
import { MenuMobileIcon } from "../../../icons/icons";
import { shortStr } from "../../../utils";
import HeaderSelect from "../HeaderSelect";
import Logo from "../LogoComponent";
import "./styles.sass";

interface IHeaderComponent {
  isOpenHeaderSelect?: boolean;
  visibleLogo?: boolean;
  logoUrl?: string;
  visibleGamburger?: boolean;
  hidden?: boolean;
  modificator?: string;
  backgroundColor?: string;
  collapsedSidebar?: boolean;
  children?: React.ReactNode;
  setCollapsedSidebar?: (status: boolean) => void;
  handlerHeaderSelect?: () => void;
  onClick?: () => void;
}

export const HeaderComponent = ({
  isOpenHeaderSelect,
  handlerHeaderSelect,
  hidden,
  visibleLogo,
  visibleGamburger,
  logoUrl,
  modificator,
  backgroundColor,
  collapsedSidebar,
  setCollapsedSidebar,
  children,
  onClick,
}: IHeaderComponent) => {
  const { isMobile } = useWindowDimensions();
  const user = useSelector((state: any) => state.user);
  const mainWallet = useSelector((state: any) => state.wallet);

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
        style={{
          width: "100%",
        }}
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
              <Logo navigateUrl={logoUrl || "/landing"} />
            </div>
          </Col>
        )}
        <Col xs={!visibleLogo ? 24 : 8}>
          <div className="header__right">
            {(user.id || mainWallet.token) && (
              <>
                <Row
                  align="middle"
                  justify="end"
                  style={{
                    width: "100%",
                  }}
                >
                  <Col>{children}</Col>
                  <Col>
                    <HeaderSelect
                      title={user.username || shortStr(mainWallet.token, 8)}
                      isOpenSelect={user.id && isOpenHeaderSelect}
                      handlerHeaderSelect={handlerHeaderSelect}
                      isNotVisibleAvatarInMobile={visibleLogo}
                    />
                  </Col>
                </Row>
              </>
            )}
          </div>
        </Col>
      </Row>
    </Header>
  );
};
