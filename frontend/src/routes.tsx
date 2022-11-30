import { Navigate, useRoutes, Outlet, RouteObject } from "react-router";
import { useSelector } from "react-redux";
import { DonationPageIcon, PeopleIcon, ShieldMenuIcon } from "./icons/icons";
import {
  PieChartOutlined,
  SettingOutlined,
  AppstoreOutlined,
} from "@ant-design/icons";

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
import RegistrationModal from "./components/RegistrationModal";
import Loader from "./components/Loader";
import DonatMessagePage from "./pages/DonatMessagePage";
import DonatGoalPage from "./pages/DonatGoalPage";
import DonatStatPage from "./pages/DonatStatPage";
import LandingPage from "./pages/LandingPage";
import ChooseWalletPage from "./pages/ChooseWalletPage";
import ChooseBlockchainPage from "./pages/ChooseBlockchainPage";
import NoPage from "./pages/NoPage";
import { adminPath } from "./consts";

const routes = {
  main: "/",
};

interface IRoute extends RouteObject {
  path?: string;
  index?: boolean;
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
      <Navigate to="/register" />
    );
  } else {
    return user.id ? <Outlet /> : <Navigate to="/register" />;
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
            index: true,
            element: <MainPage />,
            name: "Dashboard",
            icon: <PieChartOutlined />,
            menu: true,
            menuOrder: 1,
          },
          {
            path: "donat", // /:name/:token
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
  // {
  //   path: "wallets",
  //   element: <ChooseWalletPage />,
  //   hiddenLayoutElements: true,
  // },
  // {
  //   path: "blockchains/:wallet",
  //   element: <ChooseBlockchainPage />,
  //   hiddenLayoutElements: true,
  // },
  {
    path: "register",
    element: <RegistrationModal />,
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

// const test = [
//   {
//     path: "/",
//     element: <ProtectedRoutes />,
//     children: [
//       {
//         path: "/",
//         element: <ProtectedRoutes roleRequired="creators" />,
//         children: [
//           {
//             index: true,
//             path: "/",
//             element: <MainPage />,
//           },
//           {
//             path: "donat", // /:name/:token
//             element: <DonationPage />,
//           },
//           {
//             path: "widgets",
//             element: <WidgetsPage />,
//             children: [
//               {
//                 path: "alerts",
//                 element: <AlertsPage />,
//               },
//               {
//                 path: "stats",
//                 element: <StreamStatsPage />,
//               },
//               {
//                 path: "goals",
//                 element: <DonationGoalsPage />,
//               },
//             ],
//           },
//         ],
//       },
//       {
//         path: "donations",
//         element: <DonationsPage />,
//       },
//       {
//         path: "badges",
//         element: <BadgesPage />,
//       },
//       {
//         path: "settings",
//         element: <SettingsPage />,
//       },
//     ],
//   },
//   {
//     path: "register",
//     element: <RegistrationModal />,
//   },
//   {
//     path: "support/:name",
//     element: <DonatPage />,
//   },
//   {
//     path: "donat-message/:name/:token",
//     element: <DonatMessagePage />,
//   },
//   {
//     path: "donat-goal/:name/:id",
//     element: <DonatGoalPage />,
//   },
//   {
//     path: "donat-stat/:name/:id",
//     element: <DonatStatPage />,
//   },
//   {
//     path: "*",
//     element: <NoPage />,
//   },
// ];

const addChildrenRoute = (currRoute: IRoute, routersAcc: IRoute[]) => {
  // console.log(route.path);
  if (currRoute.children) {
    const mapArr = currRoute.children.map((route) => {
      // console.log(route.path);
      if (route.children) addChildrenRoute(route, routersAcc);
      return {
        path: route.path,
        element: route.element,
      };
    });
  }
  return routersAcc;
};

export const Pages = () => {
  const routerPages = routers.reduce((acc, route) => {
    if (route.children) {
      const newAcc = addChildrenRoute(route, acc);
      return newAcc;
    }
    return [
      ...acc,
      {
        path: route.path,
        element: route.element,
      },
    ];
  }, [] as IRoute[]);

  // console.log(routerPages);

  const pages = useRoutes(routers);
  return pages;
};

export type { IRoute, userRoles };
