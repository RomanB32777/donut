import { useEffect } from "react";
import { useDispatch } from "react-redux";
// import TronWalletImage from "../../assets/tronWallet";
import { closeModal } from "../../store/types/Modal";
import ChooseWalletModal from "../ChooseWalletModal";
import "./styles.sass";

declare type typeWallet = "all" | "Tronlink" | "Metamask";

const AuthModal = ({ wallet }: { wallet: typeWallet }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const clickHandler = (event: React.MouseEvent<HTMLElement> | any) => {
      if (
        event.target &&
        event.target.className &&
        event.target.className === "modal-wrapper"
      ) {
        dispatch(closeModal());
      }
    };

    document.addEventListener("click", clickHandler);

    return () => {
      document.removeEventListener("click", clickHandler);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={`auth-modal auth-modal_${wallet}`}>
      <span className="auth-modal__main-title">
        {wallet === "all"
          ? "Choose the wallet"
          : `Please login your ${wallet} wallet`}
      </span>
      {wallet === "all" ? (
        <ChooseWalletModal />
      ) : (
        <>
          <span className="auth-modal__additional-title">
            If you don’t have it, you can install by clicking the button below
          </span>
          <a
            href={
              wallet === "Tronlink"
                ? "https://chrome.google.com/webstore/detail/tronlink/ibnejdfjmmkpcnlpebklmnkoeoihofec"
                : "https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn"
            }
            target="_blank"
            className="auth-modal__link"
            rel="noreferrer"
          >
            Install {wallet}
          </a>
          <span className="auth-modal__additional-warning">
            Reload the page after installing the extension
          </span>
        </>
      )}
    </div>
  );
};

export default AuthModal;
