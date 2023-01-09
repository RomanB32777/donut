import { IFont } from "appTypes";
import { InView } from "react-intersection-observer";

import StyledText from "components/StyledText";
import { loadFont } from "utils";
import { ISelectItem } from "..";

const FontSelectOption = ({ value, key }: ISelectItem) => {
  const handleChange = (font: IFont) => async (status: boolean) => {
    if (!status) return;
    await loadFont(font);
  };
  return (
    <InView onChange={handleChange({ name: value, link: key })}>
      {({ ref }) => (
        <StyledText font={value} fontLink={key} ref={ref}>
          {value}
        </StyledText>
      )}
    </InView>
  );
};

export default FontSelectOption;
