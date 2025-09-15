// pages/index.js
import { COLORS } from "@/styles/color";
import { TYPOGRAPHY } from "@/styles/typography";
import styled from "@emotion/styled";

type RadioToggleProps = {
  selectedOption: "chatting" | "call";
  setSelectedOption: (option: "chatting" | "call") => void;
};

const RadioToggle = ({
  selectedOption,
  setSelectedOption,
}: RadioToggleProps) => {
  return (
    <Container>
      <Highlight position={selectedOption} />
      <RadioButtons>
        <RadioButton
          type="radio"
          id="plan"
          name="option"
          value="plan"
          checked={selectedOption === "chatting"}
          onClick={() => {
            setSelectedOption("chatting");
          }}
          onChange={() => {
            return;
          }}
        />
        <Label
          htmlFor="plan"
          isSelected={selectedOption === "chatting"}
          style={{ ...TYPOGRAPHY.body2.medium }}
        >
          채팅
        </Label>
        <RadioButton
          type="radio"
          id="recommend"
          name="option"
          value="recommend"
          checked={selectedOption === "call"}
          onClick={() => {
            setSelectedOption("call");
          }}
          onChange={() => {
            return;
          }}
        />
        <Label
          htmlFor="recommend"
          isSelected={selectedOption === "call"}
          style={{ ...TYPOGRAPHY.body2.medium }}
        >
          통화
        </Label>
      </RadioButtons>
    </Container>
  );
};

export default RadioToggle;

const Container = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(245, 245, 245, 0.1);
  width: 100%;
  height: 40px;
  min-height: 40px;
  border-radius: 26px;
  overflow: hidden;
  z-index: 1;

  border: 0.5px solid rgba(255, 255, 255, 0.18);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
  backdrop-filter: blur(12px) saturate(120%);
  -webkit-backdrop-filter: blur(12px) saturate(120%);
`;

const Highlight = styled.div<{ position: "chatting" | "call" }>`
  position: absolute;
  top: 2.5px;
  left: 2.5px;
  right: 2.5px;
  width: 50%;
  height: 34px;
  background-color: ${COLORS.primary[500]};
  border-radius: 26px;
  transition: transform 0.2s ease-in-out;

  transform: ${({ position }) =>
    position === "chatting" ? "translateX(0)" : "translateX(98%)"};
`;

const RadioButtons = styled.div`
  width: 100%;
  display: flex;
  position: relative;
  z-index: 2;
`;

const RadioButton = styled.input`
  display: none;
`;

const Label = styled.label<{ isSelected: boolean }>`
  flex: 1;
  padding: 0;
  cursor: pointer;
  transition: color 0.2s;
  color: ${COLORS.grayscale[100]};
  display: flex;
  justify-content: center;
  align-items: center;
`;
