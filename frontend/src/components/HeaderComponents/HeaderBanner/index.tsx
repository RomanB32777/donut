import clsx from "clsx";
import { createPortal } from "react-dom";
import "./styles.sass";

export const HeaderBanner = ({
  children,
  isVisible,
}: {
  children: React.ReactNode;
  isVisible: boolean;
}) => {
  const bannerRoot = document.getElementById("banner-root");

  if (bannerRoot) {
    return (
      <div>
        {createPortal(
          <div
            className={clsx("navbar-banner", {
              fadeInDown: isVisible,
              fadeInUp: !isVisible,
            })}
          >
            {children}
          </div>,
          bannerRoot
        )}
      </div>
    );
  }

  return null;
};
