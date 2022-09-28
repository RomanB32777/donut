import React, { useEffect } from "react";
import { Modal, ModalProps } from "antd";
import clsx from "clsx";
import useWindowDimensions from "../../hooks/useWindowDimensions";
import Loader from "../Loader";
import "./styles.sass";

interface IModalComponent extends ModalProps {
  topModal?: boolean;
  noPadding?: boolean;
  children?: React.ReactNode;
}

const ModalComponent = ({
  visible,
  title,
  width,
  confirmLoading,
  topModal,
  centered,
  onCancel,
  noPadding,
  closable,
  children,
}: IModalComponent) => (
  <Modal
    title={title}
    visible={visible}
    confirmLoading={confirmLoading || false}
    onCancel={onCancel}
    width={width || 520}
    style={{ top: topModal ? 20 : centered ? 0 : 100 }}
    closable={closable}
    footer={null}
    bodyStyle={{
      padding: noPadding ? 0 : 24,
    }}
    centered={centered || false}
  >
    <div
      className={clsx("modal-content-wrapper", {
        noPadding,
      })}
    >
      {children}
    </div>
  </Modal>
);

interface ILoadingModalComponent extends IModalComponent {
  message: string;
  visible: boolean;
}

export const LoadingModalComponent = ({
  message,
  visible,
}: ILoadingModalComponent) => (
  <ModalComponent visible={visible} closable={false} width={600}>
    <div className="donat-loading">
      <p className="donat-loading__message">{message}</p>
      <Loader size="big" />
    </div>
  </ModalComponent>
);

interface ISuccessModalComponent extends ILoadingModalComponent {
  onClose: () => void;
  showDurationPopup?: number;
  description?: string;
}

export const SuccessModalComponent = ({
  message,
  visible,
  onClose,
  showDurationPopup,
  description,
  centered,
}: ISuccessModalComponent) => {
  const { isTablet, isMobile } = useWindowDimensions();

  useEffect(() => {
    let timeOut: NodeJS.Timeout | undefined;
    if (visible)
      timeOut = setTimeout(() => {
        onClose();
      }, showDurationPopup || 5000);

    return () => clearTimeout(timeOut);
  }, [visible]);

  return (
    <ModalComponent
      visible={visible}
      closable={false}
      width={isTablet ? 500 : 700}
      topModal={!isTablet}
      noPadding
      centered={isMobile as boolean}
    >
      <div className="modal-success">
        <p className="modal-success__message">{message}</p>
        {description && (
          <p className="modal-success__description">{description}</p>
        )}
      </div>
    </ModalComponent>
  );
};

export default ModalComponent;
