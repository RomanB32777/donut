import { useMemo } from "react";
import { useSelector } from "react-redux";
import clsx from "clsx";
import { url } from "../../consts";
import { LargeImageIcon, TrashBinIcon } from "../../icons/icons";
import "./styles.sass";

import testIMG from '../../assets/person.png'

interface IContentCard {
  name: string;
  creator_id: string;
  link?: string;
  image?: string;
  desc?: string;
}

const ContentCard = (prop: { data: IContentCard; onClick?: () => void }) => {
  const user = useSelector((state: any) => state.user);
  const ableToDelete = useMemo(
    () => user && user.id && user.id === prop.data.creator_id,
    [user, prop]
  );

  return (
    <div
      className={clsx("content-panel", { ableToDelete })}
      style={{
        cursor: prop.data.link ? "pointer" : "auto",
      }}
    >
      <a
        href={prop.data.link}
        target="_blank"
        rel="noreferrer"
      >
        <div className="content-panel__image">
          {prop.data.image && prop.data.image.length > 0 ? (
            <img src={testIMG
              // url + prop.data.image
            } alt={prop.data.name} />
          ) : (
            <LargeImageIcon />
          )}
        </div>
        <div className="content-panel__info">
          <span className="title">{prop.data.name}</span>
          <span className="subtitle">{prop.data.desc}</span>
        </div>
      </a>
      {/* {ableToDelete && ( */}
      <div className="delete-icon" onClick={prop.onClick}>
        <TrashBinIcon />
      </div>
      {/* )} */}
    </div>
  );
};

export default ContentCard;