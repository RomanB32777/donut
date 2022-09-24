import { useState, useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import { ethers } from "ethers";
import clsx from "clsx";
import { abi } from "../../../consts";
import { LargeImageIcon, TrashBinIcon } from "../../../icons/icons";

import { IBadge, IBadgeData, initBadgeData } from "../../../types";
import axiosClient from "../../../axiosClient";
import { makeStorageClient } from "../utils";
import testIMG from "../../../assets/person.png";
import "./styles.sass";
import { addNotification } from "../../../utils";
import ConfirmPopup from "../../../components/ConfirmPopup";

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

  const getBadgeNFTData = async (badge: IBadge) => {
    try {
      const { contract_address, creator_id } = badge;

      const provider = new ethers.providers.Web3Provider(
        (window as any).ethereum
      );
      let currentContract = new ethers.Contract(
        contract_address,
        abi,
        provider
      );

      const currentToken = await currentContract.uri(1);

      const quantityBadge =
        user.id === creator_id
          ? await currentContract.totalSupply(1)
          : await currentContract.balanceOf(user.metamask_token, 1);

      const quantityBadgeNum = quantityBadge.toNumber();
      if (user.roleplay === "backers" && quantityBadgeNum < 1) return;

      const rootCid = currentToken.split("//")[1];
      const dataBadgeJSON = await axiosClient.get(
        `https://${rootCid}.ipfs.w3s.link/metadata.json`
      );

      if (dataBadgeJSON.status == 200) {
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
              quantity: quantityBadgeNum,
            });
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
    user.metamask_token && getBadgeNFTData(prop.data);
  }, [user, prop.data]);

  const { image, title, description, creator_id } = badgeData;

  const ableToDelete = useMemo(
    () => user.id && title && user.id === creator_id,
    [user, creator_id]
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
        <div className="content-panel__image">
          {image.preview && image.preview.length > 0 ? (
            <img src={image.preview || testIMG} alt={title} />
          ) : (
            <LargeImageIcon />
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
