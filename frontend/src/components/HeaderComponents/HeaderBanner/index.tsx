import { currBlockchain } from "../../../consts";
import "./styles.sass";

export const HeaderBanner = () => {
  return (
    <div className="navbar-banner">Currently working on {currBlockchain?.chainName} network only</div>
    // tEVMOS
  );
};
