import { useMemo, useState, useEffect } from "react";
import { useSelector } from "react-redux";
import clsx from "clsx";
import { url } from "../../../consts";
import { LargeImageIcon, TrashBinIcon } from "../../../icons/icons";
import "./styles.sass";

import { IBadge, IBadgeData, initBadgeData } from "../../../types";
import { abi } from "../consts";
import { ethers } from "ethers";
import axiosClient from "../../../axiosClient";
import { makeStorageClient } from "../utils";
import testIMG from "../../../assets/person.png";

const ContentCard = (prop: { data: IBadge; onClick?: () => void }) => {
  const user = useSelector((state: any) => state.user);
  const [badgeData, setBadgeData] = useState<IBadgeData>({ ...initBadgeData });
  // const ableToDelete = useMemo(
  //   () => user && user.id && user.id === prop.data.creator_id,
  //   [user, prop]
  // );

  const getBadgeNFTData = async (badge: IBadge) => {
    try {
      const { contract_address } = badge;

      const provider = new ethers.providers.Web3Provider(
        (window as any).ethereum
      );
      let currentContract = new ethers.Contract(
        contract_address,
        abi,
        provider
      );

      const currentToken = await currentContract.uri(1);
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

          // new Promise((resolve, reject) => {
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
            });
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getBadgeNFTData(prop.data);
  }, [prop.data]);

  const { image, title, description } = badgeData;

  console.log(badgeData);

  return (
    <div
      className={clsx("content-panel")}
      // , { ableToDelete }
      style={{
        cursor: "pointer",
      }}
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
      {/* {ableToDelete && (
        <div className="content-panel__delete-icon" onClick={prop.onClick}>
          <TrashBinIcon />
        </div>
      )} */}
    </div>
  );
};

export default ContentCard;
