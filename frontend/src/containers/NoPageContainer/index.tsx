import { Result } from "antd";
import { useNavigate } from "react-router-dom";
import { FormattedMessage } from "react-intl";

import BaseButton from "components/BaseButton";
import { RoutePaths } from "consts";
import "./styles.sass";

const NoPageContainer = () => {
  const navigate = useNavigate();
  return (
    <div className="no-page">
      <Result
        status="404"
        title="404"
        subTitle={<FormattedMessage id="not_found_title" />}
        extra={
          <BaseButton
            formatId="not_found_button"
            onClick={() =>
              navigate(`${RoutePaths.main}`, {
                replace: true,
              })
            }
            padding="8px 32px"
            fontSize="18px"
            isMain
          />
        }
      />
    </div>
  );
};

export default NoPageContainer;
