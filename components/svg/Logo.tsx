import styled from "@emotion/styled";
import LogoIcon from "./LogoIcon";
import LogoText from "./LogoText";

const Logo = ({
  fontColor = "#000", // Default color
}: {
  fontColor?: string;
}) => {
  return (
    <Container
      onClick={() => {
        window.location.href = "/";
      }}
    >
      <LogoIcon width={28} height={28} />
      <LogoText width={152} height={26} fill={fontColor} />
    </Container>
  );
};

export default Logo;

const Container = styled.div`
  display: flex;
  align-items: center;
  gap: 3px;
  cursor: pointer;
`;
