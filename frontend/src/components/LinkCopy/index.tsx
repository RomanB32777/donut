import clsx from "clsx";
import { CopyIcon } from "../../icons/icons";
import { copyStr, shortStr } from "../../utils";
import "./styles.sass";

const LinkCopy = ({
  link,
  description,
  linkLength,
  isSimple,
}: {
  link: string;
  description?: string;
  linkLength?: number;
  isSimple?: boolean;
}) => {
  return (
    <div className="link-wrapper">
      {description && !isSimple && (
        <span className="link-description">{description}</span>
      )}
      <div className={clsx(isSimple ? "simpleLink-block" : "link-block")}>
        <div className="link">
          {" "}
          {Boolean(linkLength) ? shortStr(link, linkLength as number) : link}
        </div>
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
