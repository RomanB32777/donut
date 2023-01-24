import React, { useEffect } from "react";
import { Modal, ModalProps } from "antd";
import clsx from "clsx";
import useWindowDimensions from "hooks/useWindowDimensions";
import Loader from "components/Loader";
import "./styles.sass";

interface IModalComponent extends ModalProps {
  topModal?: boolean;
  noPadding?: boolean;
  children?: React.ReactNode;
}

const ModalComponent = ({
  open,
  title,
  width,
  confirmLoading,
  topModal,
  centered,
  onCancel,
  noPadding,
  closable,
  children,
  className,
}: IModalComponent) => (
  <Modal
    title={title}
    open={open}
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
    className={clsx("app-modal", className)}
    transitionName=""
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
}

export const LoadingModalComponent = ({
  message,
  ...props
}: ILoadingModalComponent) => (
  <ModalComponent {...props} closable={false} width={600}>
    <div className="donat-loading">
      <p className="message">{message}</p>
      <Loader size="big" />
    </div>
  </ModalComponent>
);

export const ErrorModalComponent = ({
  message,
  ...props
}: ILoadingModalComponent) => (
  <ModalComponent {...props} closable={false} width={600}>
    <div className="modal-error">
      <p className="message" dangerouslySetInnerHTML={{ __html: message }} />
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
  open,
  onClose,
  showDurationPopup,
  description,
  ...props
}: ISuccessModalComponent) => {
  const { isTablet } = useWindowDimensions();

  useEffect(() => {
    let timeOut: NodeJS.Timeout | undefined;
    if (open)
      timeOut = setTimeout(() => {
        onClose();
      }, showDurationPopup || 5000);

    return () => clearTimeout(timeOut);
  }, [open]);

  return (
    <ModalComponent
      open={open}
      closable={false}
      width={isTablet ? 500 : 700}
      topModal={!isTablet}
      noPadding
      centered
    >
      <div className="modal-success" onClick={onClose}>
        <p className="message">{message}</p>
        {description && <p className="description">{description}</p>}
      </div>
    </ModalComponent>
  );
};

export default ModalComponent;
