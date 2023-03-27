import { Result } from "antd";
import { useNavigate } from "react-router-dom";
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
        subTitle="Sorry, the page you visited does not exist."
        extra={
          <BaseButton
            title="Back to Dashboard"
            onClick={() =>
              navigate(`/${RoutePaths.admin}/${RoutePaths.dashboard}`, {
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
