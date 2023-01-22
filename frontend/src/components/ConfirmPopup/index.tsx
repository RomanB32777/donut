import { Popconfirm } from "antd";
import { QuestionCircleOutlined } from "@ant-design/icons";

const ConfirmPopup = ({
  title = "Are you sure?",
  children,
  confirm,
}: {

  title?: string;
  children: React.ReactNode;
  confirm: () => void;
}) => {
  return (
    <Popconfirm
      title={title}
      icon={<QuestionCircleOutlined style={{ color: "red" }} />}
      onConfirm={confirm}
    >
      {children}
    </Popconfirm>
  );
};

export default ConfirmPopup;
