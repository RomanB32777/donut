import { useCallback, useMemo, useState } from "react";
import { FormattedMessage } from "react-intl";
import { userRoles } from "types";

import ModalComponent from "components/ModalComponent";
import RegistrationModal from "./registration-modal";
import { AuthModalTypes, ILandingModal } from "appTypes";
import LoginModal from "./login-modal";

interface IAuthModal extends ILandingModal {
  registrationRoleUser: userRoles | null;
}

const AuthModal: React.FC<IAuthModal> = ({
  isOpenModal,
  closeModal,
  registrationRoleUser,
}) => {
  const [modalType, setModalType] = useState<AuthModalTypes>("registration");

  const changeTypeModal = useCallback(
    (type: AuthModalTypes) => setModalType(type),
    []
  );

  const modalTile = useMemo(() => {
    if (modalType === "login") return "login_title";

    if (registrationRoleUser === "creators") {
      return "registration_creator_title";
    } else return "registration_backer_title";
  }, [modalType, registrationRoleUser]);

  // useEffect(() => {
  //   isOpenModal && setModalType("registration");
  // }, [isOpenModal]);

  return (
    <ModalComponent
      open={isOpenModal}
      title={<FormattedMessage id={modalTile} />}
      onCancel={closeModal}
      width={540}
      noPadding
    >
      {modalType === "registration" && registrationRoleUser ? (
        <RegistrationModal
          changeTypeModal={changeTypeModal}
          roleplay={registrationRoleUser}
        />
      ) : (
        <LoginModal changeTypeModal={changeTypeModal} />
      )}
    </ModalComponent>
  );
};

export default AuthModal;
