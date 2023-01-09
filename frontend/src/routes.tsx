import { useContext, useEffect } from "react";
import { Navigate, useRoutes, Outlet } from "react-router";
import { useDispatch } from "react-redux";
import { DonationPageIcon, PeopleIcon, ShieldMenuIcon } from "./icons";
import {
  PieChartOutlined,
  SettingOutlined,
  AppstoreOutlined,
} from "@ant-design/icons";
import { userRoles } from "types";

import { useAppSelector } from "./hooks/reduxHooks";
import { WalletContext } from "contexts/Wallet";
import MainPage from "./pages/MainPage";
import BadgesPage from "./pages/BadgesPage";
import DonatPage from "./pages/DonatPage";
import DonationsPage from "./pages/DonationsPage";
import AlertsPage from "./pages/AlertsPage";
import WidgetsPage from "./pages/WidgetsPage";
import DonationPage from "./pages/DonationPage";
import StreamStatsPage from "./pages/StreamStatsPage";
import DonationGoalsPage from "./pages/DonationGoalsPage";
import SettingsPage from "./pages/SettingsPage";
import RegistrationContainer from "./containers/RegistrationContainer";
import Loader from "./components/Loader";
import DonatMessagePage from "./pages/DonatMessagePage";
import DonatGoalPage from "./pages/DonatGoalPage";
import DonatStatPage from "./pages/DonatStatPage";
import LandingPage from "./pages/LandingPage";
import NoPage from "./pages/NoPage";
import { checkWallet } from "utils";
import { adminPath } from "./consts";

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
  const dispatch = useDispatch();
  const { walletConf } = useContext(WalletContext);
  const { user, loading } = useAppSelector((state) => state);
  const { id, roleplay } = user;

  useEffect(() => {
    !id && checkWallet({ walletConf, dispatch });
  }, [id, walletConf]);

  if (!id && loading) return <Loader size="big" />;

  //if the role required is there or not
  if (roleRequired) {
    return id ? (
      roleRequired === roleplay ? (
        <Outlet />
      ) : (
        <Navigate to={`/${adminPath}/donations`} />
      )
    ) : (
      <Navigate to="/register" />
    );
  } else {
    return id ? <Outlet /> : <Navigate to="/register" />;
  }
};

export const routers: IRoute[] = [
  {
    path: "/",
    element: <LandingPage />,
    hiddenLayoutElements: true,
    noPaddingMainConteiner: true,
  },
  {
    path: adminPath,
    element: <ProtectedRoutes />,
    protected: true,
    children: [
      {
        element: <ProtectedRoutes roleRequired="creators" />,
        roleRequired: "creators",
        protected: true,
        children: [
          {
            path: "",
            element: <MainPage />,
            name: "Dashboard",
            icon: <PieChartOutlined />,
            menu: true,
            menuOrder: 1,
          },
          {
            path: "donat",
            element: <DonationPage />,
            name: "Donation page",
            icon: <DonationPageIcon />,
            menu: true,
            menuOrder: 4,
          },
          {
            path: "widgets",
            element: <WidgetsPage />,
            name: "Widgets",
            icon: <AppstoreOutlined />,
            menu: true,
            menuOrder: 6,
            children: [
              {
                path: "alerts",
                name: "Alerts",
                element: <AlertsPage />,
                menu: true,
              },
              {
                path: "stats",
                name: "In-stream stats",
                element: <StreamStatsPage />,
                menu: true,
              },
              {
                path: "goals",
                name: "Donation goals",
                element: <DonationGoalsPage />,
                menu: true,
              },
            ],
          },
        ],
      },
      {
        path: "donations",
        element: <DonationsPage />,
        name: "Donations",
        icon: <PeopleIcon />,
        menu: true,
        menuOrder: 2,
      },
      {
        path: "badges",
        element: <BadgesPage />,
        name: "Badges",
        icon: <ShieldMenuIcon />,
        menu: true,
        menuOrder: 3,
      },
      {
        path: "settings",
        element: <SettingsPage />,
        name: "Settings",
        icon: <SettingOutlined />,
        menu: true,
        menuOrder: 5,
      },
    ],
  },
  {
    path: "register",
    element: <RegistrationContainer />,
  },
  {
    path: "support/:name",
    element: <DonatPage />,
    hiddenLayoutElements: true,
    noPaddingMainConteiner: true,
  },
  {
    path: "donat-message/:name/:token",
    element: <DonatMessagePage />,
    hiddenLayoutElements: true,
    transparet: true,
  },
  {
    path: "donat-goal/:name/:id",
    element: <DonatGoalPage />,
    hiddenLayoutElements: true,
    transparet: true,
  },
  {
    path: "donat-stat/:name/:id",
    element: <DonatStatPage />,
    hiddenLayoutElements: true,
    transparet: true,
  },
  {
    path: "*",
    element: <NoPage />,
  },
];

type routerPathsType = Record<string, string>;
// type routerPathsType<T> = Record<T, string>;

const addRouteWithPath = ({ path }: IRoute, routersAcc: any) => {
  if (path && !path.includes("*")) {
    const pathValue = path.split("/")[0];
    const key = pathValue || "main";
    return {
      ...routersAcc,
      [key]: pathValue || "/",
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
  }, initObj as Record<keyof typeof initObj, string>);
  return routerPages;
};

const routerPaths = initRoutersObj(routers, {});

const Pages = () => {
  const pages = useRoutes(routers);
  return pages;
};

export type { IRoute, userRoles };
export { routerPaths, Pages };
