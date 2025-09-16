import MagnifierIcon from "@/components/svg/MagnifierIcon";
import ConnectionIcon from "@/components/svg/ConnectionIcon";
import AIcon from "@/components/svg/AIcon";
import { COLORS } from "@/styles/color";
import { TYPOGRAPHY } from "@/styles/typography";
import styled from "@emotion/styled";
import { usePathname, useRouter } from "next/navigation";

const GNB = () => {
  const router = useRouter();
  const pathName = usePathname();
  return (
    <Container style={{}}>
      <GNBItem
        style={{ ...TYPOGRAPHY.caption["medium"] }}
        selected={pathName === "/"}
        onClick={() => {
          window.location.href = "/";
        }}
      >
        <MagnifierIcon
          fill={
            pathName === "/" ? COLORS.grayscale[1300] : COLORS.grayscale[600]
          }
        />
        탐색
      </GNBItem>
      <GNBItem
        style={{ ...TYPOGRAPHY.caption["medium"] }}
        selected={pathName === "/connection"}
        onClick={() => {
          window.location.href = "/connection";
        }}
      >
        <ConnectionIcon
          fill={
            pathName === "/connection"
              ? COLORS.grayscale[1300]
              : COLORS.grayscale[600]
          }
        />
        연결
      </GNBItem>
      <GNBItem
        style={{ ...TYPOGRAPHY.caption["medium"] }}
        selected={pathName.startsWith("/stage")}
        onClick={() => {
          window.location.href = "/stage";
        }}
      >
        <AIcon
          fill={
            pathName === "/stage"
              ? COLORS.grayscale[1300]
              : COLORS.grayscale[600]
          }
        />
        스테이지
      </GNBItem>
    </Container>
  );
};

export default GNB;

const Container = styled.div`
  width: 100%;
  height: 88px;
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-around;
  background-color: white;
  color: #fff;
  font-size: 1.5rem;
  font-weight: bold;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.05);

  overflow: hidden;
  z-index: 10;
`;

const GNBItem = styled.div<{
  selected?: boolean;
}>`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  gap: 2px;
  color: ${COLORS.grayscale[600]};
  transition: all 0.2s ease-in-out;
  min-width: 50px;
  padding-top: 10px;
  cursor: pointer;

  ${({ selected }) =>
    selected &&
    `
    color: ${COLORS.grayscale[1300]};
    font-weight: 800;
    letter-spacing: 0%;
  `}

  svg > path {
    transition: fill 0.2s ease-in-out;
  }

  svg > circle {
    transition: fill 0.2s ease-in-out;
  }
`;
