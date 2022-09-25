import { Col, Row } from "antd";
import { Header } from "antd/lib/layout/layout";
import clsx from "clsx";
import { useSelector } from "react-redux";
import { shortStr } from "../../../../utils";
import HeaderSelect from "../HeaderSelect";
import Logo from "../Logo";

interface IHeaderComponent {
  isOpenHeaderSelect?: boolean;
  visibleLogo?: boolean;
  logoUrl?: string;
  hidden?: boolean;
  modificator?: string;
  backgroundColor?: string;
  children?: React.ReactNode;
  handlerHeaderSelect?: () => void;
  onClick?: () => void;
}

export const HeaderComponent = ({
  isOpenHeaderSelect,
  handlerHeaderSelect,
  hidden,
  visibleLogo,
  logoUrl,
  modificator,
  backgroundColor,
  children,
  onClick,
}: IHeaderComponent) => {
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
        {visibleLogo && (
          <Col span={8}>
            <div className="header__left">
              <Logo navigateUrl={logoUrl || "/landing"} />
            </div>
          </Col>
        )}
        <Col span={!visibleLogo ? 24 : 10}>
          <div className="header__right">
            {(user.id || mainWallet.token) && (
              <>
                <Row align="middle" justify="end">
                  <Col>{children}</Col>
                  <Col>
                    <HeaderSelect
                      title={user.username || shortStr(mainWallet.token, 8)}
                      isOpenSelect={user.id && isOpenHeaderSelect}
                      handlerHeaderSelect={handlerHeaderSelect}
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
