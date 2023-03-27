import { memo } from "react";
import clsx from "clsx";
import "./styles.sass";

declare type typeSizeLoader = "big" | "middle" | "small";

interface ILoader {
  size: typeSizeLoader;
  modificator?: string;
}

const Loader: React.FC<ILoader> = ({ size, modificator }) => (
  <div className={clsx("loader", `loader-${size}`, modificator)}>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
  </div>
);

export default memo(Loader);
