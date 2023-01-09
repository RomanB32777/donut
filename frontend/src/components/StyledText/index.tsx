import styled from "styled-components";

const StyledText = styled.span<{
  color?: string;
  font: string;
  fontLink: string;
}>`
  font-family: "${({ font }) => font}", sans-serif;
  color: ${({ color }) => color};
`;
// @font-face {
//   font-family: "${({ font }) => font}";
//   font-weight: 400;
//   font-style: normal;
//   src: url("${({ fontLink }) => fontLink}");
// }

export default StyledText;
