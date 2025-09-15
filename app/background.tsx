"use client";
import styled from "@emotion/styled";
import { keyframes } from "@emotion/react";

const Background = () => {
  return (
    <AuroraBackground
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: -1,
      }}
    />
  );
};

export default Background;

const drift1 = keyframes`
  0%   { transform: translate(-8%, -6%) scale(1); }
  50%  { transform: translate(6%, 4%) scale(1.12); }
  100% { transform: translate(-8%, -6%) scale(1); }
`;

const drift2 = keyframes`
  0%   { transform: translate(6%, -4%) scale(1.05) rotate(0deg); }
  50%  { transform: translate(-6%, 6%) scale(1.18) rotate(10deg); }
  100% { transform: translate(6%, -4%) scale(1.05) rotate(0deg); }
`;

export const AuroraBackground = styled.div`
  position: relative;
  isolation: isolate;
  overflow: hidden;
  background: #f93b32; /* 베이스 톤 */
  min-height: 100vh;

  /* 오로라 레이어 1 */
  &::before {
    content: "";
    position: absolute;
    inset: -25%;
    background:
      radial-gradient(
        55% 60% at 20% 25%,
        rgba(255, 255, 255, 0.75),
        rgba(255, 184, 142, 0) 60%
      ),
      radial-gradient(
        45% 55% at 80% 35%,
        rgba(232, 17, 13, 0.55),
        rgba(232, 17, 13, 0) 60%
      ),
      radial-gradient(
        60% 65% at 40% 80%,
        rgba(255, 141, 113, 0.55),
        rgba(255, 141, 113, 0) 60%
      );
    filter: blur(48px);
    animation: ${drift1} 28s ease-in-out infinite alternate;
    mix-blend-mode: screen;
    pointer-events: none;
  }

  /* 오로라 레이어 2 */
  &::after {
    content: "";
    position: absolute;
    inset: -30%;
    background:
      radial-gradient(
        50% 55% at 30% 30%,
        rgba(249, 59, 50, 0.75),
        rgba(249, 59, 50, 0) 60%
      ),
      radial-gradient(
        55% 60% at 70% 70%,
        rgba(255, 255, 255, 0.75),
        rgba(255, 255, 255, 0) 60%
      );
    filter: blur(64px);
    animation: ${drift2} 32s ease-in-out infinite alternate;
    mix-blend-mode: screen;
    pointer-events: none;
  }

  @media (prefers-reduced-motion: reduce) {
    &::before,
    &::after {
      animation: none;
    }
  }
`;
