import React, { useRef, useState } from "react";
import LoadingSpinner from "../LoadingSpinner";
import styled from "@emotion/styled";

const BackgroundVideo = ({ hidden = false }: { hidden?: boolean }) => {
  const [isVideoLoading, setIsVideoLoading] = useState(true);
  const [isMVideoLoading, setIsMVideoLoading] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const mVideoRef = useRef<HTMLVideoElement>(null);

  const handleVideoCanPlay = () => {
    setIsVideoLoading(false);
    videoRef.current?.play().catch((err) => console.debug("Play fail", err));
  };

  const handleMVideoCanPlay = () => {
    setIsMVideoLoading(false);
    mVideoRef.current?.play().catch((err) => console.debug("Play fail", err));
  };

  return (
    <Container style={{ display: hidden ? "none" : "block" }}>
      {(isVideoLoading || isMVideoLoading) && <LoadingSpinner />}
      <Video
        ref={videoRef}
        autoPlay
        muted
        loop
        onCanPlay={handleVideoCanPlay}
        preload="auto"
      >
        <source src="/videos/splash.mp4" type="video/mp4" />
        비디오를 지원하지 않는 브라우저입니다.
      </Video>
      <MVideo
        ref={mVideoRef}
        autoPlay
        muted
        loop
        onCanPlay={handleMVideoCanPlay}
        preload="auto"
        playsInline
      >
        <source src="/videos/splash.mp4" type="video/mp4" />
        비디오를 지원하지 않는 브라우저입니다.
      </MVideo>
      {/* <Shade /> */}
    </Container>
  );
};

export default BackgroundVideo;

const Container = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  max-width: 480px;
  overflow: hidden;
`;

const Video = styled.video`
  position: absolute;
  top: 50%;
  left: 50%;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transform: translate(-50%, -50%);

  @media (max-width: 768px) {
    display: none;
  }
`;

const MVideo = styled.video`
  position: absolute;
  top: 50%;
  left: 50%;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transform: translate(-50%, -50%);

  @media (min-width: 768px) {
    display: none;
  }
`;
