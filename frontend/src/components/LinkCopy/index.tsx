import { useMemo } from "react";
import clsx from "clsx";
import { CopyIcon } from "icons";
import { copyStr, shortStr } from "utils";
import "./styles.sass";

const LinkCopy = ({
  link,
  title,
  description,
  linkLength,
  isSimple,
}: {
  link: string;
  title?: string;
  description?: string;
  linkLength?: number;
  isSimple?: boolean;
}) => {
  const renderLink = useMemo(() => {
    if (title) return title;
    return linkLength ? shortStr(link, linkLength) : link;
  }, [linkLength, link, title]);

  return (
    <div className="link-wrapper">
      {description && !isSimple && (
        <span className="link-description">{description}</span>
      )}
      <div className={clsx(isSimple ? "simpleLink-block" : "link-block")}>
        <div className="link">{renderLink}</div>
        <div
          className="icon"
          onClick={(event: React.MouseEvent<HTMLDivElement>) => {
            event.stopPropagation();
            copyStr(link);
          }}
        >
          <CopyIcon />
        </div>
      </div>
    </div>
  );
};

export default LinkCopy;
