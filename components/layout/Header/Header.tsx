import { MenuIcon } from "@/components/svg";
import Logo from "@/components/svg/Logo";
import styled from "@emotion/styled";
import { useRouter } from "next/navigation";

const Header = () => {
  const router = useRouter();
  return (
    <Container>
      <LogoButton
        onClick={() => {
          window.location.href = "/";
        }}
      >
        <Logo fontColor="white" />
      </LogoButton>
      <MenuButton
        onClick={() => {
          router.push("/my");
        }}
      >
        <MenuIcon />
      </MenuButton>
    </Container>
  );
};

export default Header;

const Container = styled.div`
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  overflow: hidden;
  padding-right: 16px;
  padding-left: 16px;
  height: 57px;
  background-color: transparent;
`;

const LogoButton = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  z-index: 2;

  // hover effect
  // animation for hover effect
  transition: opacity 0.3s ease;
  &:hover {
    opacity: 0.85;
  }
`;

const MenuButton = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
  z-index: 2; /* Ensure the menu button is above other elements */
`;
