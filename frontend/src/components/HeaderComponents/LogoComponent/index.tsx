import clsx from "clsx";
import { useNavigate } from "react-router";
import { scrollToPosition } from "utils";
import "./styles.sass";

const Logo = ({
  navigateUrl = "/",
  modificator,
}: {
  navigateUrl?: string;
  modificator?: string;
}) => {
  const navigate = useNavigate();

  const redirect = () => {
    navigate(navigateUrl);
    scrollToPosition();
  };

  return (
    <div
      className={clsx("main-logo", { [modificator as string]: modificator })}
      onClick={redirect}
    >
      <span>Crypto Donutz</span>
    </div>
  );
};

export default Logo;
