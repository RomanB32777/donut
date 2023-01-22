import React, { useRef, useState } from "react";
import clsx from "clsx";
import { DownOutlined } from "@ant-design/icons";
import useOnClickOutside from "hooks/useClickOutside";
import "./styles.sass";

interface ISelectComponent<T> {
  title: React.ReactNode;
  list: T[];
  selected?: T;
  headerList?: React.ReactNode;
  footerList?: React.ReactNode;
  modificator?: string;
  listModificator?: string;
  listItemModificator?: string;
  listWrapperModificator?: string;
  selectItem: (item: T) => void;
  renderOption?: (item: T) => React.ReactNode;
}

const SelectComponent = <T extends unknown>({
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
  renderOption,
}: React.PropsWithChildren<ISelectComponent<T>>) => {
  const blockRef = useRef(null);
  const [isOpenSelect, setOpenSelect] = useState(false);

  const selectHandler = () => setOpenSelect((prev) => !prev);

  const itemHandler = (selected: T) => {
    setOpenSelect(false);
    selectItem(selected);
  };

  useOnClickOutside(isOpenSelect, blockRef, selectHandler);

  return (
    <div className={clsx("select", modificator)} ref={blockRef}>
      <div
        className="block"
        onClick={() => {
          setOpenSelect(!isOpenSelect);
        }}
      >
        <div className="title">{title}</div>
        <div
          className={clsx("icon", "icon-arrow", {
            rotated: isOpenSelect,
          })}
        >
          <DownOutlined />
        </div>
      </div>
      {isOpenSelect && (
        <div
          className={clsx("list-wrapper fadeInBlur", listWrapperModificator)}
        >
          {headerList}
          <div className={clsx("list", listModificator)}>
            {list.map((item, key) => (
              <div
                className={clsx("list-item", {
                  [listItemModificator as string]: listItemModificator,
                  active: item === title || item === selected,
                })}
                key={key}
                onClick={() => itemHandler(item)}
              >
                {renderOption ? renderOption(item) : (item as React.ReactNode)}
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
