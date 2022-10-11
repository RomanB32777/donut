import { useState, useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import clsx from "clsx";
import { walletsConf } from "../../../utils";
import { TrashBinIcon } from "../../../icons/icons";

import { IBadge, IBadgeData, initBadgeData } from "../../../types";
import axiosClient from "../../../axiosClient";
import { makeStorageClient } from "../utils";
import testIMG from "../../../assets/person.png";
import ConfirmPopup from "../../../components/ConfirmPopup";
import Loader from "../../../components/Loader";
import "./styles.sass";

const ContentCard = (prop: {
  data: IBadge;
  onClick: (badge: IBadgeData) => void;
  deleteBadge: (badge: IBadgeData) => void;
}) => {
  const user = useSelector((state: any) => state.user);
  const [badgeData, setBadgeData] = useState<IBadgeData>({
    ...initBadgeData,
    ...prop.data,
  });

  const getBadgeData = async (badge: IBadge) => {
    try {
      const walletKey = process.env.REACT_APP_WALLET || "metamask";
      const wallet = walletsConf[walletKey];
      const { contract_address, creator_id } = badge;

      const currentToken = await wallet.getBadgeURI(contract_address);
      
      const quantity = await wallet.getQuantityBalance({
        contract_address,
        supporter_address: user[`${walletKey}_token`],
        isCreator: user.id === creator_id,
      });

      if (user.roleplay === "backers" && quantity < 1) return;

      if (currentToken) {
        const rootCid = currentToken.split("//")[1];
        const dataBadgeJSON = await axiosClient.get(
          `https://${rootCid}.ipfs.w3s.link/metadata.json`
        );

        if (dataBadgeJSON.status === 200) {
          const client = makeStorageClient();
          const imgCid = dataBadgeJSON.data.URI.split("//")[1];
          const res = await client.get(imgCid); // Web3Response

          if (res) {
            const files = await res.files(); // Web3File[]

            const reader = new FileReader();
            reader.readAsDataURL(files[0]);
            reader.onload = () =>
              setBadgeData({
                ...badgeData,
                ...dataBadgeJSON.data,
                image: {
                  ...badgeData.image,
                  preview: (reader.result as string) || "",
                },
                contract_address,
                quantity,
              });
          }
        }
      }
    } catch (error) {
      console.log(error);
      // addNotification({
      //   type: "danger",
      //   title: "Error",
      //   message:
      //     (error as Error).message || `An error occurred while saving data`,
      // });
    }
  };

  useEffect(() => {
    const walletKey = process.env.REACT_APP_WALLET || "metamask";
    user[`${walletKey}_token`] && getBadgeData(prop.data);
  }, [user, prop.data]);

  const { image, title, description, creator_id } = badgeData;

  const ableToDelete = useMemo(
    () => user.id && title && user.id === creator_id,
    [user, title, creator_id]
  );

  return (
    <div
      className={clsx("content-panel", {
        // ableToDelete,
      })}
      style={{
        cursor: title.length ? "pointer" : "auto",
      }}
      onClick={() => title.length && prop.onClick(badgeData)}
    >
      <div className="content-panel__Link">
        <div
          className="content-panel__image"
          style={{
            height: image.preview && image.preview.length > 0 ? 220 : 256,
          }}
        >
          {image.preview && image.preview.length > 0 ? (
            <img src={image.preview || testIMG} alt={title} />
          ) : (
            <Loader size="big" />
          )}
        </div>
        <div className="content-panel__info">
          <span className="content-panel__info-title">{title}</span>
          <span className="content-panel__info-subtitle">{description}</span>
        </div>
      </div>
      {ableToDelete && (
        <div
          className="content-panel__delete-icon"
          onClick={(e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()}
        >
          <ConfirmPopup confirm={() => prop.deleteBadge(badgeData)}>
            <div>
              <TrashBinIcon />
            </div>
          </ConfirmPopup>
        </div>
      )}
    </div>
  );
};

export default ContentCard;
