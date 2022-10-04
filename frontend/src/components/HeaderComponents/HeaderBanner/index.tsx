import { walletsConf } from "../../../consts";
import "./styles.sass";

export const HeaderBanner = () => {
  const currBlockchain = walletsConf[
    process.env.REACT_APP_WALLET || "metamask"
  ].blockchains.find((b) => b.name === process.env.REACT_APP_BLOCKCHAIN);

  return (
    <div className="navbar-banner">Currently working on {currBlockchain?.chainName} network only</div>
    // tEVMOS
  );
};
