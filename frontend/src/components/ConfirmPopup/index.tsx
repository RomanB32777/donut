import { Popconfirm } from "antd";
import { QuestionCircleOutlined } from "@ant-design/icons";

const ConfirmPopup = ({
  children,
  confirm,
}: {
  children: React.ReactNode;
  confirm: () => void;
}) => {
  return (
    <Popconfirm
      title="Are you sure？"
      icon={<QuestionCircleOutlined style={{ color: "red" }} />}
      onConfirm={confirm}
    >
      {children}
    </Popconfirm>
  );
};

export default ConfirmPopup;
