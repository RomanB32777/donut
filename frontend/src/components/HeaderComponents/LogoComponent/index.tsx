import { FC, memo } from "react";
import clsx from "clsx";
import { useNavigate } from "react-router";
import { scrollToPosition } from "utils";
import "./styles.sass";

interface ILogo {
  navigateUrl?: string;
  modificator?: string;
}

const Logo: FC<ILogo> = ({ navigateUrl = "/", modificator }) => {
  const navigate = useNavigate();

  const redirect = () => {
    navigate(navigateUrl);
    scrollToPosition();
  };

  return (
    <div className={clsx("main-logo", modificator)} onClick={redirect}>
      <span>Crypto Donutz</span>
    </div>
  );
};

export default memo(Logo);
