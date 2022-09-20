import { Navigate, useRoutes, Outlet, RouteObject } from "react-router";
import MainPage from "./pages/MainPage";
import BadgesPage from "./pages/BadgesPage";
import DonatPage from "./pages/DonatPage";

import {
  DonationPageIcon,
  PeopleIcon,
  ShieldMenuIcon,
  // WidgetsIcon,
} from "./icons/icons";
import {
  PieChartOutlined,
  SettingOutlined,
  AppstoreOutlined,
} from "@ant-design/icons";

import DonationsPage from "./pages/DonationsPage";
import AlertsPage from "./pages/AlertsPage";
import WidgetsPage from "./pages/WidgetsPage";
import DonationPage from "./pages/DonationPage";
import StreamStatsPage from "./pages/StreamStatsPage";
import DonationGoalsPage from "./pages/DonationGoalsPage";
import SettingsPage from "./pages/SettingsPage";
import RegistrationModal from "./components/RegistrationModal";
import { useSelector } from "react-redux";
import ChooseWalletModal from "./components/ChooseWalletModal";
import Loader from "./components/Loader";
import DonatMessagePage from "./pages/DonatMessagePage";
import DonatGoalPage from "./pages/DonatGoalPage";
import DonatStatPage from "./pages/DonatStatPage";

const routes = {
  main: "/",
  creator: "/creator/:name",
  profile: "/profile",
  createNewBadge: "/create-new-badge",
  badges: "/badges",
  notifications: "/notifications",
  donat: "/donat/:name/:token",
  donatMessage: "/donat-message/:name/:random",
  supporters: "/supporters/",
  nft: "/nft",
  createNft: "/create-nft",
  followers: "/followers",
  transactions: "/transactions",
  following: "/following",
  creators: "/creators",
  backers: "/backers",
};

interface IRoute extends RouteObject {
  name?: string;
  menu?: boolean;
  icon?: React.ReactNode;
  children?: IRoute[];
  roleRequired?: string;
  protected?: boolean;
  hiddenLayoutElements?: boolean;
  noPaddingMainConteiner?: boolean;
}

declare type userRoles = "creators" | "backers";

//protected Route state
type ProtectedRouteType = {
  roleRequired?: userRoles;
};

const ProtectedRoutes = (props: ProtectedRouteType) => {
  const user = useSelector((state: any) => state.user);
  const { isLoading } = useSelector((state: any) => state.loading);

  if (!user.id && isLoading) return <Loader size="big" />;

  //if the role required is there or not
  if (props.roleRequired) {
    return user.id ? (
      props.roleRequired === user.roleplay ? (
        <Outlet />
      ) : (
        <Navigate to="/donations" />
      )
    ) : (
      <Navigate to="/login" />
    );
  } else {
    return user.id ? <Outlet /> : <Navigate to="/login" />;
  }
};

export const routers: IRoute[] = [
  {
    path: "/",
    element: <ProtectedRoutes />,
    protected: true,
    children: [
      {
        path: "/",
        element: <ProtectedRoutes roleRequired="creators" />,
        roleRequired: "creators",
        protected: true,
        children: [
          {
            index: true,
            path: "/",
            element: <MainPage />,
            name: "Dashboard",
            icon: <PieChartOutlined />,
            menu: true,
          },
          {
            path: "donat", // /:name/:token
            element: <DonationPage />,
            name: "Donation page",
            icon: <DonationPageIcon />,
            menu: true,
          },
          {
            path: "widgets",
            element: <WidgetsPage />,
            name: "Widgets",
            icon: <AppstoreOutlined />,
            menu: true,
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
      },
      {
        path: "badges",
        element: <BadgesPage />,
        name: "Badges",
        icon: <ShieldMenuIcon />,
        menu: true,
      },
      {
        path: "settings",
        element: <SettingsPage />,
        name: "Settings",
        icon: <SettingOutlined />,
        menu: true,
      },
    ],
  },
  {
    path: "login",
    element: <ChooseWalletModal />,
    hiddenLayoutElements: true,
  },
  {
    path: "register",
    element: <RegistrationModal />,
  },
  {
    path: "support/:name/:token",
    element: <DonatPage />,
    noPaddingMainConteiner: true,
  },
  {
    path: "donat-message/:name/:token",
    element: <DonatMessagePage />,
    hiddenLayoutElements: true,
  },
  {
    path: "donat-goal/:name/:id",
    element: <DonatGoalPage />,
    hiddenLayoutElements: true,
  },
  {
    path: "donat-stat/:name/:id",
    element: <DonatStatPage />,
    hiddenLayoutElements: true,
  },
];
export const Pages = () => {
  const pages = useRoutes(routers);
  return pages;
};

export type { IRoute, userRoles };
export default routes;