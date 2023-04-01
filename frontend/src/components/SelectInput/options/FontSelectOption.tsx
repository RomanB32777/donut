import { FC, memo } from "react";
import { InView } from "react-intersection-observer";
import { IFont } from "appTypes";

import { loadFont } from "utils";
import { ISelectItem } from "..";

interface IFontStyleElement {
  fontName: string;
}

const FontStyleElement: FC<IFontStyleElement> = memo(({ fontName }) => (
  <span
    style={{
      fontFamily: `"${fontName}", sans-serif`,
    }}
  >
    {fontName}
  </span>
));

const FontSelectOption: FC<ISelectItem> = ({ value, key }) => {
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
