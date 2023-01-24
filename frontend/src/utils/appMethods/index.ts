import { AnyAction, Dispatch } from "redux";
import { NavigateFunction } from "react-router-dom";

import { setUser } from "store/types/User";
import { setSelectedBlockchain } from "store/types/Wallet";
import { initUser, storageWalletKey } from "consts";

const scrollToPosition = (top = 0) => {
  try {
    window.scroll({
      top: top,
      left: 0,
      behavior: "smooth",
    });
  } catch (_) {
    window.scrollTo(0, top);
  }
};

const logoutUser = ({
  dispatch,
  navigate,
}: {
  dispatch: Dispatch<AnyAction>;
  navigate: NavigateFunction;
}) => {
  dispatch(setUser(initUser));
  localStorage.removeItem(storageWalletKey);
  dispatch(setSelectedBlockchain(null));
  navigate("/");
};

const isValidateFilledForm = (valuesArray: any[]) =>
  valuesArray.every((val) => Boolean(val));

const delay = ({ ms, cb }: { ms: number; cb: (params?: any) => any }) =>
  new Promise<void>((resolve) => {
    setTimeout(() => {
      cb();
      resolve();
    }, ms);
  });

export { scrollToPosition, logoutUser, isValidateFilledForm, delay };
