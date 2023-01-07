import clsx from "clsx";
import { useState } from "react";
import { SmallToggleListArrowIcon } from "../../icons";
import "./styles.sass";

const SelectComponent = ({
  title,
  list,
  selected,
  headerList,
  footerList,
  modificator,
  listModificator,
  listItemModificator,
  listWrapperModificator,
  selectItem,
}: {
  title: React.ReactNode;
  list: string[];
  selected?: string;
  headerList?: React.ReactNode;
  footerList?: React.ReactNode;
  modificator?: string;
  listModificator?: string;
  listItemModificator?: string;
  listWrapperModificator?: string;
  selectItem: (item: string) => void;
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
        <div
          className={clsx("list-wrapper", {
            [listWrapperModificator as string]: listWrapperModificator,
          })}
        >
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
                  active: item === title || item === selected,
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
