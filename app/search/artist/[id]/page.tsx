"use client";
import styled from "@emotion/styled";
import { use } from "react";
import Image from "next/image";
import { ARTIST_DATA } from "@/components/view/SearchMainView";
import { LeftChevronIcon } from "@/components/svg";
import { useRouter } from "next/navigation";
import { TYPOGRAPHY } from "@/styles/typography";
import { COLORS } from "@/styles/color";
import InstagramIcon from "@/components/svg/InstagramIcon";
import YoutubeIcon from "@/components/svg/YoutubeIcon";

const ArtistPage = ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = use(params);
  const router = useRouter();

  const artist = ARTIST_DATA.find((artist) => artist.id === Number(id));
  if (!artist) {
    return <div>Artist not found</div>;
  }

  console.log("Artist ID:", id);
  return (
    <Container>
      <ShadowHeader>
        <div onClick={() => router.back()} style={{ cursor: "pointer" }}>
          <LeftChevronIcon fill="#FFFFFF" />
        </div>
      </ShadowHeader>
      <div style={{ position: "relative", width: "100%", height: "248px" }}>
        <Image
          src={artist.profileImage}
          alt={artist.name}
          fill
          sizes="100%"
          style={{ objectFit: "cover" }}
          priority
        />
      </div>
      <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
          flexDirection: "column",
          gap: 4,
          padding: "25px 16px",
        }}
      >
        <div
          style={{
            ...TYPOGRAPHY.body1["medium"],
            color: COLORS.grayscale[1300],
          }}
        >
          레벨
          {artist.level} | {artist.score}
        </div>
        <div
          style={{
            ...TYPOGRAPHY.h2["bold"],
          }}
        >
          {artist.name}
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          <InstagramIcon />
          <YoutubeIcon />
        </div>
      </div>
      <div></div>
    </Container>
  );
};

export default ArtistPage;

const Container = styled.main`
  background-color: white;
  width: 100%;
  height: calc(var(--vh, 1vh) * 100);
  position: relative;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-direction: column;
  overflow-x: hidden;
  overflow-y: hidden;
  -webkit-overflow-scrolling: touch;
  &::-webkit-scrollbar {
    display: none;
  }
  scrollbar-width: none;
  -ms-overflow-style: none; /* IE and Edge */
`;

const ShadowHeader = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 57px;
  z-index: 10;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding: 0 16px;
  background: linear-gradient(
    180deg,
    rgba(0, 0, 0, 0.15) 0%,
    rgba(0, 0, 0, 0) 100%
  );
`;
