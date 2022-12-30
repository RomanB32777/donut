import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { WalletContext } from "../../contexts/Wallet";
import { useAppDispatch } from "../../hooks/reduxHooks";
import { setSelectedBlockchain } from "../../store/types/Wallet";
import "./styles.sass";

const ChooseBlockchainContainer = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { walletConf } = useContext(WalletContext);

  const blockchainChoose = async (name: string) => {
    await walletConf.changeBlockchain(name);
    dispatch(setSelectedBlockchain(name));
    navigate("/register");
  };

  return (
    <div className="blockchains-popup">
      <p className="title">Choose the blockchain</p>
      <div className="list">
        {walletConf.blockchains.map(({ name, chainName, icon }) => (
          <div className="item" key={name}>
            <div className="img">
              <img src={icon} alt={name + "_icon"} />
            </div>
            <div className="name" onClick={() => blockchainChoose(name)}>
              {chainName}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChooseBlockchainContainer;
