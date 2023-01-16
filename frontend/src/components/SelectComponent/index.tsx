import clsx from "clsx";
import React, { useState } from "react";
import { DownOutlined } from "@ant-design/icons";
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
}: React.PropsWithChildren<ISelectComponent<T>>) => {
  const [isOpenSelect, setOpenSelect] = useState(false);

  const itemHandler = (selected: T) => {
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
          className={clsx("icon", "icon-arrow", {
            rotated: isOpenSelect,
          })}
        >
          <DownOutlined />
        </div>
      </div>
      {isOpenSelect && (
        <div
          className={clsx("list-wrapper fadeInBlur", {
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
                {item as React.ReactNode}
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
