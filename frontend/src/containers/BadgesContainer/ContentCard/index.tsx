import { useState, useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import clsx from "clsx";
import { IBadgeInfo, IBadgeShort } from "types";

import { TrashBinIcon } from "../../../icons";
import { IBadge } from "../../../types";
import testIMG from "../../../assets/person.png";
import ConfirmPopup from "../../../components/ConfirmPopup";
import Loader from "../../../components/Loader";
import { initBadgeData } from "../../../consts";
import "./styles.sass";

const ContentCard = ({
  data,
  onClick,
  deleteBadge,
  getBadgeData,
}: {
  data: IBadgeShort;
  onClick: (badge: IBadge) => void;
  deleteBadge: (badge: IBadge) => void;
  getBadgeData: (badge: IBadgeShort) => Promise<any>;
}) => {
  const user = useSelector((state: any) => state.user);
  const [badgeData, setBadgeData] = useState<IBadge>({
    ...initBadgeData,
    ...data,
  });

  useEffect(() => {
    const getCardData = async () => {
      const cardData = await getBadgeData(data);
      cardData && setBadgeData({ ...badgeData, ...cardData });
    };
    user.wallet_address && getCardData();
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
