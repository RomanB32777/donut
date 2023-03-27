import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FormattedMessage } from "react-intl";

import BaseButton from "components/BaseButton";
import { HeaderBanner } from "components/HeaderComponents/HeaderBanner";
import { useResendConfirmMutation } from "store/services/AuthService";
import { addErrorNotification } from "utils";
import { delayNotVisibleBanner, RoutePaths } from "consts";
import "./styles.sass";

const ResendConfirmContainer = () => {
  const navigate = useNavigate();
  const [resendPassword, { isLoading, isSuccess }] = useResendConfirmMutation();

  const [searchParams] = useSearchParams();
  const [isVisibleBanner, setIsVisibleBanner] = useState(false);

  const email = searchParams.get("email");

  const btnHandler = async () => {
    if (email) {
      await resendPassword(email);
    }
  };

  useEffect(() => {
    if (!email) {
      addErrorNotification({ message: "Invalid email" });
      navigate(RoutePaths.main);
    }
  }, [email]);

  useEffect(() => {
    if (isSuccess) {
      setTimeout(() => setIsVisibleBanner(false), delayNotVisibleBanner);
    }
  }, [isSuccess]);

  return (
    <div className="resendModal">
      {isSuccess && (
        <HeaderBanner isVisible={isVisibleBanner}>
          <FormattedMessage id="sent_activation_link" values={{ email }} />
        </HeaderBanner>
      )}
      <h1 className="modalTitle">
        <FormattedMessage id="resend_title" />
      </h1>
      <div className="resendInput">
        <span className="title">
          <FormattedMessage id="resend_button_title" />
        </span>

        <div className="btnWrapper">
          <BaseButton
            formatId="resend_button"
            onClick={btnHandler}
            modificator="resendBtn"
            disabled={isLoading}
            isMain
          />
        </div>
      </div>
    </div>
  );
};

export default ResendConfirmContainer;
