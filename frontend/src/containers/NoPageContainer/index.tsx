import { Result } from "antd";
import { useNavigate } from "react-router-dom";
import BaseButton from "../../components/BaseButton";
import { adminPath } from "../../consts";
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
            onClick={() => navigate(`/${adminPath}`, { replace: true })}
            padding="8px 32px"
            fontSize="18px"
            isBlue
          />
        }
      />
    </div>
  );
};

export default NoPageContainer;
