import React from "react";
import { BackTop, Layout } from "antd";
import { Pages } from "../../routes";

import "./styles.sass";

const { Content } = Layout;

const LayoutApp = () => {

  return (
    <Layout
      style={{
        minHeight: "100vh",
        position: "relative",
      }}
    >
      <BackTop />
      <Layout className="site-layout">
        <Content>
          <div className="main-container">
            <Pages />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default LayoutApp;
