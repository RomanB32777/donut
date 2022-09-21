import React from "react";
import { Modal, ModalProps } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import "./styles.sass";

interface IModalComponent extends ModalProps {
  topModal?: boolean;
  children?: React.ReactNode;
}

const ModalComponent = ({
  visible,
  title,
  width,
  confirmLoading,
  topModal,
  onCancel,
  closable,
  children,
}: IModalComponent) => (
  <Modal
    title={title}
    visible={visible}
    confirmLoading={confirmLoading || false}
    onCancel={onCancel}
    width={width || 520}
    style={{ top: topModal ? 20 : 100 }}
    closable={closable}
    footer={null}
  >
    {children}
  </Modal>
);

export default ModalComponent;
