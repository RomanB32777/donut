import React from "react";
import { Modal, ModalProps } from "antd";
import "./styles.sass";

interface IModalComponent extends ModalProps {
  topModal?: boolean;
  setIsVisible: (status: boolean) => void;
  children?: React.ReactNode;
}

const ModalComponent = ({
  visible,
  title,
  width,
  setIsVisible,
  confirmLoading,
  topModal,
  children,
}: IModalComponent) => {
  const handleCancel = () => {
    setIsVisible(false);
  };

  return (
    <Modal
      title={title}
      visible={visible}
      confirmLoading={confirmLoading || false}
      onCancel={handleCancel}
      width={width || 520}
      style={{ top: topModal ? 20 : 100 }}
      footer={null}
    >
      {children}
    </Modal>
  );
};

export default ModalComponent;
