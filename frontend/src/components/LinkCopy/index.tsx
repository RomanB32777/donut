import clsx from "clsx";
import { CopyIcon } from "../../icons/icons";
import { addNotification } from "../../utils";
import "./styles.sass";

const LinkCopy = ({
  link,
  description,
  isSimple,
}: {
  link: string;
  description?: string;
  isSimple?: boolean;
}) => {
  return (
    <div className="link-wrapper">
      {description && !isSimple && (
        <span className="link-description">{description}</span>
      )}
      <div className={clsx(isSimple ? "simpleLink-block" : "link-block")}>
        <div className="link">{link}</div>
        <div
          className="icon"
          onClick={(event: React.MouseEvent<HTMLDivElement>) => {
            event.stopPropagation();
            try {
              navigator.clipboard.writeText(link);
              addNotification({
                type: "success",
                title: "Link successfully copied",
              });
            } catch (error) {
              addNotification({
                type: "warning",
                title: "An error occurred while copying the link",
              });
            }
          }}
        >
          <CopyIcon />
        </div>
      </div>
    </div>
  );
};

export default LinkCopy;
