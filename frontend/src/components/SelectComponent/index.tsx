import clsx from "clsx";
import { useState } from "react";
import { SmallToggleListArrowIcon } from "../../icons/icons";
import "./styles.sass";

const SelectComponent = ({
  title,
  list,
  selectItem,
  modificator,
}: {
  title: string;
  list: string[];
  selectItem: (item: string) => void;
  modificator?: string;
}) => {
  const [isOpenSelect, setOpenSelect] = useState(false);

  return (
    <div
      className={clsx("select", {
        [modificator as string]: modificator,
      })}
      onClick={() => {
        setOpenSelect(!isOpenSelect);
      }}
    >
      <span className="select__title">{title}</span>
      <div
        className={clsx("select__icon", {
          rotated: isOpenSelect,
        })}
      >
        <SmallToggleListArrowIcon />
      </div>
      {isOpenSelect && (
        <div className="select__list">
          {list.map((item, key) => (
            <div
              className={clsx("select__list-item", {
                active: item === title,
              })}
              key={key}
              onClick={() => selectItem(item)}
            >
              {item}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SelectComponent;
