import React, { useMemo } from "react";
import { useLocation } from "react-router";
import { FloatButton, Layout } from "antd";
import DocumentTitle from "react-document-title";
import clsx from "clsx";

import { Pages, routersInfo, routers } from "routes";
import "./styles.sass";

const { Content } = Layout;

const transparentClass = "transparent";

const LayoutApp = () => {
  const { pathname } = useLocation();

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
        </Layout>
      </Layout>
    </DocumentTitle>
  );
};

export default LayoutApp;
