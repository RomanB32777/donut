import clsx from "clsx";
import { useState } from "react";
import { SmallToggleListArrowIcon } from "../../icons";
import "./styles.sass";

const SelectComponent = ({
  title,
  list,
  selectItem,
  headerList,
  footerList,
  modificator,
  listModificator,
  listItemModificator,
}: {
  title: React.ReactNode;
  list: string[];
  selectItem: (item: string) => void;
  headerList?: React.ReactNode;
  footerList?: React.ReactNode;
  modificator?: string;
  listModificator?: string;
  listItemModificator?: string;
}) => {
  const [isOpenSelect, setOpenSelect] = useState(false);

  const itemHandler = (selected: string) => {
    setOpenSelect(false);
    selectItem(selected);
  };

  return (
    <div
      className={clsx("select", {
        [modificator as string]: modificator,
      })}
    >
      <div
        className="block"
        onClick={() => {
          setOpenSelect(!isOpenSelect);
        }}
      >
        <div className="title">{title}</div>
        <div
          className={clsx("icon", {
            rotated: isOpenSelect,
          })}
        >
          <SmallToggleListArrowIcon />
        </div>
      </div>
      {isOpenSelect && (
        <div className="list-wrapper">
          {headerList}
          <div
            className={clsx("list", {
              [listModificator as string]: listModificator,
            })}
          >
            {list.map((item, key) => (
              <div
                className={clsx("list-item", {
                  [listItemModificator as string]: listItemModificator,
                  active: item === title,
                })}
                key={key}
                onClick={() => itemHandler(item)}
              >
                {item}
              </div>
            ))}
          </div>
          {footerList}
        </div>
      )}
    </div>
  );
};

export default SelectComponent;
