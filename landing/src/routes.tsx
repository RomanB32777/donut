import { useRoutes, RouteObject } from "react-router";
import ChooseCurrencyModal from "./components/ChooseCurrencyModal";

import ChooseWalletModal from "./components/ChooseWalletModal";
import LandingPage from "./pages/LandingPage";


export const routers: RouteObject[] = [
  {
    path: "/",
    element: <LandingPage />,
  },
  {
    path: "wallets",
    element: <ChooseWalletModal />,
  },
  {
    path: "currencies/:wallet",
    element: <ChooseCurrencyModal />,
  },
];

export const Pages = () => {
  const pages = useRoutes(routers);
  return pages;
};