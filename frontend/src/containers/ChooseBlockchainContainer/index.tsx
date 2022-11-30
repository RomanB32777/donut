import { useParams } from "react-router";
import { walletsConf } from "../../utils";
import "./styles.sass";

const ChooseBlockchainContainer = () => {
  const { wallet } = useParams();

  return (
    <div className="blockchains-popup">
      <p className="blockchains-popup__main-title">
        Choose the blockchain {/* in {wallet} */}
      </p>
      <div className="blockchains-popup__registration_list">
        {walletsConf[wallet as string].blockchains.map(({ name, icon }) => (
          <div className="blockchains-popup__registration_list-item" key={name}>
            <div className="blockchains-popup__registration_list-img">
              <img src={icon} alt={name + "_icon"} />
            </div>
            {/* <div
              className="blockchains-popup__registration_list-btn"
              onClick={() => window.open(appLink, "_blank")}
            >
              {name}
            </div> */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChooseBlockchainContainer;
