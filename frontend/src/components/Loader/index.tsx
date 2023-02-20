import { FC, memo } from "react";
import "./styles.sass";

declare type typeSizeLoader = "big" | "middle" | "small";

interface ILoader {
  size: typeSizeLoader;
}

const Loader: FC<ILoader> = ({ size }) => (
  <div className={`loader loader-${size}`}>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
  </div>
);

export default memo(Loader);
