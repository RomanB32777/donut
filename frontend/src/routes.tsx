import React, { useEffect } from "react";
import { Navigate, useRoutes, Outlet } from "react-router";
import { DonationPageIcon, PeopleIcon, ShieldMenuIcon } from "icons";
import {
  PieChartOutlined,
  SettingOutlined,
  AppstoreOutlined,
} from "@ant-design/icons";
import { userRoles } from "types";

import MainPage from "pages/MainPage";
import BadgesPage from "pages/BadgesPage";
import DonatPage from "pages/DonatPage";
import DonationsPage from "pages/DonationsPage";
import AlertsPage from "pages/AlertsPage";
import WidgetsPage from "pages/WidgetsPage";
import DonationPage from "pages/DonationPage";
import StreamStatsPage from "pages/StreamStatsPage";
import DonationGoalsPage from "pages/DonationGoalsPage";
import SettingsPage from "pages/SettingsPage";
import ResetPasswordContainer from "containers/ResetPasswordContainer";
import ChangePasswordContainer from "containers/ChangePasswordContainer";
import ResendConfirmContainer from "containers/ResendConfirmContainer";
import AdminContainer from "containers/AdminContainer";
import Loader from "components/Loader";
import DonatAlertPage from "pages/DonatAlertPage";
import DonatGoalPage from "pages/DonatGoalPage";
import DonatStatPage from "pages/DonatStatPage";
import LandingPage from "pages/LandingPage";
import NoPage from "pages/NoPage";

import { useAppSelector } from "hooks/reduxHooks";
import useAuth from "hooks/useAuth";
import { RoutePaths } from "consts";

interface IRoute {
  path?: string;
  name?: string;
  menu?: boolean;
  element?: React.ReactNode | null;
  errorElement?: React.ReactNode | null;
  icon?: React.ReactNode;
  children?: IRoute[];
  roleRequired?: string;
  protected?: boolean;
  menuOrder?: number;
  transparet?: boolean;
  hiddenLayoutElements?: boolean;
  noPaddingMainConteiner?: boolean;
}

//protected Route state
type ProtectedRouteType = {
  roleRequired?: userRoles;
};

const ProtectedRoutes = ({ roleRequired }: ProtectedRouteType) => {
  const { id, roleplay } = useAppSelector(({ user }) => user);
  const loading = useAppSelector(({ loading }) => loading);
  const { checkAuth } = useAuth();

  useEffect(() => {
    !id && checkAuth();
  }, [id]);

  if (!id && loading) return <Loader size="big" />;

  // if the role required is there or not
  if (roleRequired)
    return id ? (
      roleRequired === roleplay ? (
        <Outlet />
      ) : (
        <Navigate to={`/${RoutePaths.admin}/${RoutePaths.donations}`} />
      )
    ) : (
      <Navigate to={RoutePaths.main} />
    );
  return id ? <Outlet /> : <Navigate to={RoutePaths.main} />;
};

export const routers: IRoute[] = [
  {
    path: RoutePaths.main,
    element: <LandingPage />,
    hiddenLayoutElements: true,
    noPaddingMainConteiner: true,
  },
  {
    path: RoutePaths.admin,
    element: (
      <AdminContainer>
        <ProtectedRoutes />
      </AdminContainer>
    ),
    protected: true,
    name: "Admin",
    children: [
      {
        element: <ProtectedRoutes roleRequired="creators" />,
        roleRequired: "creators",
        protected: true,
        children: [
          {
            path: RoutePaths.dashboard,
            element: <MainPage />,
            name: "sidebar_dashboard",
            icon: <PieChartOutlined />,
            menu: true,
            menuOrder: 1,
          },
          {
            path: RoutePaths.donat,
            element: <DonationPage />,
            name: "sidebar_donation_page",
            icon: <DonationPageIcon />,
            menu: true,
            menuOrder: 4,
          },
          {
            path: RoutePaths.widgets,
            element: <WidgetsPage />,
            name: "sidebar_widgets",
            icon: <AppstoreOutlined />,
            menu: true,
            menuOrder: 6,
            children: [
              {
                path: RoutePaths.alerts,
                name: "sidebar_widgets_alerts",
                element: <AlertsPage />,
                menu: true,
              },
              {
                path: RoutePaths.stats,
                name: "sidebar_widgets_stats",
                element: <StreamStatsPage />,
                menu: true,
              },
              {
                path: RoutePaths.goals,
                name: "sidebar_widgets_goals",
                element: <DonationGoalsPage />,
                menu: true,
              },
            ],
          },
        ],
      },
      {
        path: RoutePaths.donations,
        element: <DonationsPage />,
        name: "sidebar_donations",
        icon: <PeopleIcon />,
        menu: true,
        menuOrder: 2,
      },
      {
        path: RoutePaths.badges,
        element: <BadgesPage />,
        name: "sidebar_badges",
        icon: <ShieldMenuIcon />,
        menu: true,
        menuOrder: 3,
      },
      {
        path: RoutePaths.settings,
        element: <SettingsPage />,
        name: "sidebar_settings",
        icon: <SettingOutlined />,
        menu: true,
        menuOrder: 5,
      },
    ],
  },
  {
    path: RoutePaths.reset,
    name: "Reset password",
    element: <ResetPasswordContainer />,
  },
  {
    path: RoutePaths.change,
    name: "Change password",
    element: <ChangePasswordContainer />,
  },
  {
    path: RoutePaths.resend,
    name: "Resend confirm email",
    element: <ResendConfirmContainer />,
  },
  {
    path: `${RoutePaths.support}/:name`,
    name: "Donat page",
    element: <DonatPage />,
    hiddenLayoutElements: true,
    noPaddingMainConteiner: true,
  },
  {
    path: `${RoutePaths.donatMessage}/:name/:id`,
    name: "Donat alert page",
    element: <DonatAlertPage />,
    hiddenLayoutElements: true,
    transparet: true,
  },
  {
    path: `${RoutePaths.donatGoal}/:name/:id`,
    name: "Donat goal page",
    element: <DonatGoalPage />,
    hiddenLayoutElements: true,
    transparet: true,
  },
  {
    path: `${RoutePaths.donatStat}/:name/:id`,
    name: "Donat stat page",
    element: <DonatStatPage />,
    hiddenLayoutElements: true,
    transparet: true,
  },
  {
    path: "*",
    element: <NoPage />,
  },
];

type routerPathsValue = { path: string; name: string };
type routerPathsType = Record<string, routerPathsValue>;

const addRouteWithPath = ({ path, name }: IRoute, routersAcc: any) => {
  if (path && !path.includes("*")) {
    const pathValue = path.split("/")[0];
    const key = pathValue || "main";
    return {
      ...routersAcc,
      [key]: { path: pathValue || "/", name },
    };
  }
  return routersAcc;
};

const initRoutersObj = (
  routers: IRoute[],
  initObj: routerPathsType
): routerPathsType => {
  const routerPages = routers.reduce((obj, route) => {
    if (route.children) {
      const newObjWithChilds = initRoutersObj(route.children, obj);
      const newObjWithParent = addRouteWithPath(route, initObj);
      return { ...newObjWithParent, ...newObjWithChilds };
    }
    return addRouteWithPath(route, obj);
  }, initObj as Record<keyof typeof initObj, routerPathsValue>);
  return routerPages;
};

const routersInfo = initRoutersObj(routers, {});

const Pages = () => {
  const pages = useRoutes(routers);
  return pages;
};

export type { IRoute, userRoles };
export { RoutePaths, routersInfo, Pages };
