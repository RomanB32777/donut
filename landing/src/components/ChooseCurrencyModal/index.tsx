import { useParams } from "react-router";
import { wallets } from "../../consts";
import "./styles.sass";

const ChooseCurrencyModal = () => {
  const { wallet } = useParams();

  return (
    <div className="currencies-popup">
      <p className="currencies-popup__main-title">
        Choose the blockchain in {wallet}
      </p>
      <div className="currencies-popup__registration_list">
        {wallets[wallet as string].currencies.map(({ name, appLink, img }) => (
          <div className="currencies-popup__registration_list-item" key={name}>
            <div className="currencies-popup__registration_list-img">
              <img src={img} alt={name + "_icon"} />
            </div>
            <div
              className="currencies-popup__registration_list-btn"
              onClick={() => window.open(appLink, "_blank")}
            >
              {name}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChooseCurrencyModal;
