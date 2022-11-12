import { useState, useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import clsx from "clsx";

import { TrashBinIcon } from "../../../icons/icons";
import { IBadge, IBadgeData, initBadgeData } from "../../../types";
import testIMG from "../../../assets/person.png";
import ConfirmPopup from "../../../components/ConfirmPopup";
import Loader from "../../../components/Loader";
import "./styles.sass";

const ContentCard = (prop: {
  data: IBadge;
  onClick: (badge: IBadgeData) => void;
  deleteBadge: (badge: IBadgeData) => void;
  getBadgeData: (badge: IBadge) => Promise<any>;
}) => {
  const { data, onClick, deleteBadge, getBadgeData } = prop;
  const user = useSelector((state: any) => state.user);
  const [badgeData, setBadgeData] = useState<IBadgeData>({
    ...initBadgeData,
    ...data,
  });

  useEffect(() => {
    const getCardData = async () => {
      const cardData = await getBadgeData(data);
      cardData && setBadgeData({ ...badgeData, ...cardData });
    };

    const walletKey = process.env.REACT_APP_WALLET || "metamask";
    user[`${walletKey}_token`] && getCardData();
  }, [user, data]);

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
      onClick={() => title.length && onClick(badgeData)}
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
          <ConfirmPopup confirm={() => deleteBadge(badgeData)}>
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
