import { useState, useEffect, useMemo } from "react";
import clsx from "clsx";
import { IBadgeShort } from "types";

import ConfirmPopup from "components/ConfirmPopup";
import Loader from "components/Loader";
import { TrashBinIcon } from "icons";

import { useAppSelector } from "hooks/reduxHooks";
import { initBadgeData } from "consts";
import { IBadge } from "appTypes";
import testIMG from "assets/person.png";
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
  const { id, wallet_address } = useAppSelector(({ user }) => user);
  const [badgeData, setBadgeData] = useState<IBadge>({
    ...initBadgeData,
    ...data,
  });

  useEffect(() => {
    const getCardData = async () => {
      const cardData = await getBadgeData(data);
      cardData && setBadgeData({ ...badgeData, ...cardData });
    };
    wallet_address && getCardData();
  }, [wallet_address, data]);

  const { image, title, description, creator_id } = badgeData;

  const ableToDelete = useMemo(
    () => id && title && id === creator_id,
    [id, title, creator_id]
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
