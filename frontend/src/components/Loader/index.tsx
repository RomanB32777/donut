import "./styles.sass";

declare type typeSizeLoader = "big" | "middle" | "small";

const Loader = ({ size }: { size: typeSizeLoader }) => {
  return (
    <div className={`loader loader-${size}`}>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  );
};

export default Loader;
