import { IFont } from "appTypes";
import { InView } from "react-intersection-observer";

import { loadFont } from "utils";
import { ISelectItem } from "..";

const FontStyleElement = ({ fontName }: { fontName: string }) => (
  <span
    style={{
      fontFamily: `"${fontName}", sans-serif`,
    }}
  >
    {fontName}
  </span>
);

const FontSelectOption = ({ value, key }: ISelectItem) => {
  const handleChange = (font: IFont) => async (status: boolean) => {
    if (!status) return;
    await loadFont(font);
  };
  return (
    <InView onChange={handleChange({ name: value, link: key })}>
      {({ ref }) => (
        <div ref={ref}>
          <FontStyleElement fontName={value} />
        </div>
      )}
    </InView>
  );
};

export { FontStyleElement, FontSelectOption };
