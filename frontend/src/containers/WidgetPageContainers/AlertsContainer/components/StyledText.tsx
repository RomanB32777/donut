import styled from "styled-components";
// import FontFaceObserver from "fontfaceobserver";

const StyledText = styled.span<{
  color?: string;
  font: string;
  fontLink: string;
}>`
  @font-face {
    font-family: "${({ font }) => font}";
    font-weight: 400;
    font-style: normal;
    src: url("${({ fontLink }) => fontLink}");
  }
  font-family: "${({ font }) => font}", sans-serif;
  color: ${({ color }) => color};
`;

export default StyledText;
