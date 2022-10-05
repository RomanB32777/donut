import { useRoutes, RouteObject } from "react-router";
import ChooseBlockchainModal from "./components/ChooseBlockchainModal";

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
    path: "blockchains/:wallet",
    element: <ChooseBlockchainModal />,
  },
];

export const Pages = () => {
  const pages = useRoutes(routers);
  return pages;
};