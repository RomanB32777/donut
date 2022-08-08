import { useSelector } from "react-redux";
import { url } from "../../consts";
import { LargeImageIcon, TrashBinIcon } from "../../icons/icons";
import "./styles.sass";

const NftPanel = (prop: {
  data: any;
  ableToDelete?: boolean;
  onClick?: () => void;
}) => {
  const user = useSelector((state: any) => state.user);

  return (
    <div
      className="nft-panel ableToDelete"
      style={{
        cursor: prop.data.nft_link.length > 0 ? "pointer" : "auto",
      }}
    >
      <a
        href={prop.data.nft_link}
        target={prop.data.nft_link.length > 0 ? "_blank" : ""}
        rel="noreferrer"
      >
        <div className="nft-panel__image">
          {prop.data.nft_image && prop.data.nft_image.length > 0 ? (
            <img src={url + prop.data.nft_image} />
          ) : (
            <LargeImageIcon />
          )}
        </div>
        <div className="nft-panel__info">
          <span className="title">{prop.data.nft_name}</span>
          <span className="subtitle">{prop.data.nft_desc}</span>
        </div>
      </a>
      {user && user.id && user.id === prop.data.creator_id && (
        <div className="delete-icon" onClick={prop.onClick}>
          <TrashBinIcon />
        </div>
      )}
    </div>
  );
};

export default NftPanel;
