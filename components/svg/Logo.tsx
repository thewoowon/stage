import styled from "@emotion/styled";
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
      <LogoText width={84} height={21} fill={fontColor} />
    </Container>
  );
};

export default Logo;

const Container = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
`;
