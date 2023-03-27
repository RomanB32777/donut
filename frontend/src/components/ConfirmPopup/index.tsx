import { Popconfirm } from "antd";
import { useIntl } from "react-intl";
import { QuestionCircleOutlined } from "@ant-design/icons";

const ConfirmPopup = ({
  children,
  title = "confirm_sure",
  cancelText = "confirm_cancel",
  okText = "confirm_ok",
  confirm,
}: {
  children: React.ReactNode;
  title?: string;
  cancelText?: string;
  okText?: string;
  confirm: () => void;
}) => {
  const intl = useIntl();
  return (
    <Popconfirm
      title={intl.formatMessage({ id: title })}
      icon={<QuestionCircleOutlined style={{ color: "red" }} />}
      cancelText={intl.formatMessage({ id: cancelText })}
      okText={intl.formatMessage({ id: okText })}
      onConfirm={confirm}
    >
      {children}
    </Popconfirm>
  );
};

export default ConfirmPopup;
