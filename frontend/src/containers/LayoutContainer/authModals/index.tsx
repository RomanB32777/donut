import AuthModal from "./auth-modal";
import RolesModal from "./role-modal ";
import { WalletsModal } from "components/ModalComponent/wallets-modal";
import useAuth from "hooks/useAuth";

const AuthModals = () => {
  const {
    activeAuthModal,
    registrationRoleUser,
    closeAuthModal,
    chooseRole,
    selectAuthWallet,
  } = useAuth();

  return (
    <>
      <RolesModal
        isOpenModal={activeAuthModal === "roles"}
        closeModal={closeAuthModal}
        chooseRole={chooseRole}
      />
      <AuthModal
        isOpenModal={activeAuthModal === "sign"}
        registrationRoleUser={registrationRoleUser}
        closeModal={closeAuthModal}
      />
      <WalletsModal
        open={activeAuthModal === "wallets"}
        connectedWallet={selectAuthWallet}
        onCancel={closeAuthModal}
        isRegistration
      />
    </>
  );
};

export default AuthModals;
