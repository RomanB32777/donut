import { memo } from "react";
import { IBadgeInfo } from "types";
import ConfirmPopup from "components/ConfirmPopup";
import { TrashBinIcon } from "icons";
import "./styles.sass";

const ContentCard = ({
  data,
  onClick,
  deleteBadge,
}: {
  data: IBadgeInfo;
  onClick: (badge: IBadgeInfo) => void;
  deleteBadge: (badgeID: number) => void;
}) => {
  const { id, image, title, description, is_creator, token_id } = data;

  const openBadgePape = () => onClick(data);
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
      {is_creator && !token_id && (
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
