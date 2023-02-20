import React, { FC, useEffect, useState } from "react";
import AdminSidebar from "components/AdminComponents/AdminSidebar";
import AdminHeader from "components/AdminComponents/AdminHeader";

import useWindowDimensions from "hooks/useWindowDimensions";

import "./styles.sass";

interface IAdminContainer {
  children?: React.ReactNode;
}

const AdminContainer: FC<IAdminContainer> = ({ children }) => {
  const { isTablet } = useWindowDimensions();
  const [collapsed, setCollapsed] = useState(true);

  useEffect(() => {
    isTablet ? setCollapsed(true) : setCollapsed(false);
  }, [isTablet]);

  return (
    <>
      <AdminSidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <AdminHeader
        collapsedSidebar={collapsed}
        setCollapsedSidebar={setCollapsed}
      />
      <div
        style={{
          paddingLeft: isTablet ? 0 : 250,
        }}
      >
        {children}
      </div>
    </>
  );
};

export default AdminContainer;
