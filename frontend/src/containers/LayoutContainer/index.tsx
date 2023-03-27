import { useMemo, useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import { useSearchParams } from "react-router-dom";
import { skipToken } from "@reduxjs/toolkit/dist/query";
import { FloatButton, Layout } from "antd";
import DocumentTitle from "react-document-title";
import clsx from "clsx";

import Loader from "components/Loader";
import AuthModals from "./authModals";
import useAuth from "hooks/useAuth";
import { Pages, routersInfo, routers, RoutePaths } from "routes";
import { useCheckTokenQuery } from "store/services/AuthService";
import { setAuthToken } from "utils";
import "./styles.sass";

const { Content } = Layout;

const transparentClass = "transparent";

const LayoutApp = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const { checkAuth, isAuthLoading } = useAuth();

  const tokenId = searchParams.get("token");
  const confirmStatus = searchParams.get("confirmStatus");
  const email = searchParams.get("email");

  const { data: tokenData, isError } = useCheckTokenQuery(tokenId ?? skipToken);

  const isTransparentMainConteiner: boolean = useMemo(() => {
    const pathsWithTransparentBgLayoutElements = routers.filter(
      (route) => route.transparet
    );

    const isTransparent = pathsWithTransparentBgLayoutElements.some(
      (route) => pathname.split("/")[1] === route.path?.split("/")[0]
    );

    const bodyClasses = document.querySelector("body")?.classList;

    if (bodyClasses)
      isTransparent
        ? bodyClasses.add(transparentClass)
        : bodyClasses.remove(transparentClass);

    return isTransparent;
  }, [pathname]);

  const noPaddingMainConteiner: boolean = useMemo(() => {
    const pathsWithoutPaddingMainConteiner = routers.filter(
      (route) => route.noPaddingMainConteiner
    );

    return pathsWithoutPaddingMainConteiner.some(
      (route) => pathname.split("/")[1] === route.path?.split("/")[0]
    );
  }, [pathname]);

  const titleApp: string | undefined = useMemo(() => {
    const pathElements = pathname.split("/");
    const allRoutesPath = Object.keys(routersInfo);

    const currentPage = pathElements.reverse().find((el) => {
      return allRoutesPath.includes(el);
    });

    if (currentPage) return routersInfo[currentPage].name;
    return "";
  }, [pathname]);

  useEffect(() => {
    const checkTokenData = async () => {
      if (tokenData && confirmStatus === "true") {
        setAuthToken(tokenData.access_token);
        await checkAuth();
        searchParams.delete("token");
        searchParams.delete("confirmStatus");
        setSearchParams(searchParams);
      }
    };

    checkTokenData();
  }, [tokenData, confirmStatus]);

  useEffect(() => {
    if (confirmStatus === "false" && email) navigate(RoutePaths.main);
  }, [confirmStatus, email]);

  useEffect(() => {
    if (isError) navigate(RoutePaths.main);
  }, [isError]);

  if (isAuthLoading) {
    return (
      <div className="appLoader">
        <Loader size="big" />
      </div>
    );
  }

  return (
    <DocumentTitle
      title={`Crypto Donutz${
        Boolean(titleApp?.length) ? ` - ${titleApp}` : ""
      }`}
    >
      <Layout
        className={clsx("layout-container", {
          [transparentClass]: isTransparentMainConteiner,
        })}
      >
        <FloatButton.BackTop />
        <Layout
          className={clsx("site-layout", {
            [transparentClass]: isTransparentMainConteiner,
          })}
        >
          <Content
            className={clsx("content-container", {
              [transparentClass]: isTransparentMainConteiner,
            })}
          >
            <div
              className={clsx("main-container", {
                noPadding: noPaddingMainConteiner,
              })}
            >
              <Pages />
            </div>
          </Content>
          <AuthModals />
        </Layout>
      </Layout>
    </DocumentTitle>
  );
};

export default LayoutApp;
