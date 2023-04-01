import { memo } from "react";
import { IBadgeInfo } from "types";
import ConfirmPopup from "components/ConfirmPopup";
import { TrashBinIcon } from "icons";
import "./styles.sass";

interface IBadgeCard
  extends Pick<
    IBadgeInfo,
    "id" | "title" | "image" | "description" | "tokenId" | "isCreator"
  > {}

const ContentCard = ({
  data,
  onClick,
  deleteBadge,
}: {
  data: IBadgeCard;
  onClick: (badgeId: string) => void;
  deleteBadge: (badgeId: string) => void;
}) => {
  const { id, image, title, description, isCreator, tokenId } = data;

  const openBadgePape = () => onClick(id);
  const deleteBadgePape = () => deleteBadge(id);

  return (
    <div className="badge" onClick={openBadgePape}>
      <div className="link">
        <div className="image">
          <img src={image} alt={title} />
        </div>
        <div className="info">
          <span className="title">{title}</span>
          <span className="subtitle">{description}</span>
        </div>
      </div>
      {isCreator && !tokenId && (
        <div
          className="delete-icon"
          onClick={(e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()}
        >
          <ConfirmPopup confirm={deleteBadgePape}>
            <div>
              <TrashBinIcon />
            </div>
          </ConfirmPopup>
        </div>
      )}
    </div>
  );
};

export default memo(ContentCard);
