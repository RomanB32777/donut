import { useNavigate } from "react-router";
import DonutzLogo from "../../../assets/DonutzLogo.png";
import "./styles.sass";

const Logo = ({ navigateUrl }: { navigateUrl: string }) => {
  const navigate = useNavigate();
  return (
    <div className="main-logo" onClick={() => navigate(navigateUrl)}>
      <span>Crypto Donutz</span>
      <img src={DonutzLogo} alt="donut logo" />
    </div>
  );
};

export default Logo;
