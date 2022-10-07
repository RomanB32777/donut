import { Result } from "antd";
import { useNavigate } from "react-router-dom";
import BaseButton from "../../components/BaseButton";
import "./styles.sass";

const NoPageContainer = () => {
  const navigate = useNavigate();
  return (
    <div>
      <Result
        status="404"
        title="404"
        subTitle="Sorry, the page you visited does not exist."
        extra={
          <BaseButton
            title="Back to Dashboard"
            onClick={() => navigate("/", { replace: true })}
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
