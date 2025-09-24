"use client";

import { LeftChevronIcon } from "@/components/svg";
import DownChevronIcon from "@/components/svg/DownChevronIcon";
import { useUser } from "@/contexts/UserContext";
import customAxios from "@/lib/axios";
import { COLORS } from "@/styles/color";
import { TYPOGRAPHY } from "@/styles/typography";
import {
  ArtistConnectedResponseType,
  ProjectConnectedResponseType,
} from "@/type";
import styled from "@emotion/styled";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { use, useState } from "react";

const LoaderLottie = () => {
  return (
    <DotLottieReact
      src="/lotties/loading_gray.lottie" // public/anims/hero.lottie
      autoplay
      loop
      style={{
        width: "32px",
        height: "32px",
      }}
    />
  );
};

const SortOptionsContextMenu = ({
  open,
  options,
  selectedOption,
  onSelect,
}: {
  open: boolean;
  options: string[];
  selectedOption?: string | null;
  onSelect: (option: string) => void;
  onClose: () => void;
}) => {
  if (!open) return null;

  return (
    <ContextMenuContainer>
      {options.length === 0 && (
        <div style={{ padding: "8px 12px", color: COLORS.grayscale[500] }}>
          없음
        </div>
      )}
      {options.length > 0 &&
        options.map((option) => (
          <ContextMenuItem
            key={option}
            onClick={(e) => {
              e.stopPropagation();
              onSelect(option);
            }}
            style={{
              ...TYPOGRAPHY.body2["regular"],
              backgroundColor:
                selectedOption === option ? COLORS.grayscale[400] : "",
            }}
          >
            {option}
          </ContextMenuItem>
        ))}
    </ContextMenuContainer>
  );
};

const ContextMenuContainer = styled.div`
  width: 100%;
  position: absolute;
  top: 110%;
  left: 0;
  background-color: ${COLORS.grayscale[100]};
  border: 1px solid ${COLORS.grayscale[500]};
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  z-index: 1000;
`;

const ContextMenuItem = styled.div`
  padding: 8px 12px;
  cursor: pointer;
  &:hover {
    background-color: ${COLORS.grayscale[400]};
  }
`;

const ArtistConnectionPage = ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = use(params);
  const router = useRouter();
  const { user } = useUser();
  const [project, setProject] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [contextMenuOpen, setContextMenuOpen] = useState(false);

  const { data: artistData, isLoading: artistIsLoading } =
    useQuery<ArtistConnectedResponseType>({
      queryKey: ["connected", "artist", "received", id],
      queryFn: async () => {
        const response = await customAxios.get(`/api/connect/getArtist`, {
          params: { connectId: id },
        });

        if (response.status !== 200) {
          throw new Error("Network response was not ok");
        }

        return response.data;
      },
      enabled: !!id,
    });

  const { data: projectData, isLoading: projectIsLoading } =
    useQuery<ProjectConnectedResponseType>({
      queryKey: ["connected", "project", "received", id],
      queryFn: async () => {
        const response = await customAxios.get(`/api/connect/getProject`, {
          params: { connectId: id },
        });

        if (response.status !== 200) {
          throw new Error("Network response was not ok");
        }

        return response.data;
      },
      enabled: !!id,
    });

  if (artistIsLoading || projectIsLoading) {
    return (
      <Container>
        <HeaderWithTitle>
          <div
            onClick={() => router.back()}
            style={{ cursor: "pointer", position: "absolute", left: 16 }}
          >
            <LeftChevronIcon fill="#111111" />
          </div>
          <div>연결 상세</div>
        </HeaderWithTitle>
        <div
          style={{
            width: "100%",
            flex: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            paddingBottom: "100px",
          }}
        >
          <LoaderLottie />
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div style={{ flex: 1, width: "100%" }}>
        <HeaderWithTitle>
          <div
            onClick={() => router.back()}
            style={{ cursor: "pointer", position: "absolute", left: 16 }}
          >
            <LeftChevronIcon fill="#111111" />
          </div>
          <div>연결 상세</div>
        </HeaderWithTitle>
        <div style={{ padding: "0 16px", width: "100%", marginBottom: "40px" }}>
          <Title
            style={{
              ...TYPOGRAPHY.h3["bold"],
              color: "#111111",
            }}
          >
            {artistData?.name}님이 보내온 <br />
            연결을 확인해보세요
          </Title>
        </div>
        <div
          style={{ padding: "0px 16px", width: "100%", marginBottom: "40px" }}
        >
          <div
            style={{
              padding: "12px 14px",
              width: "100%",
              border: `0.7px solid ${COLORS.grayscale[500]}`,
            }}
          >
            <Flex style={{ ...TYPOGRAPHY.body2["regular"] }}>
              <div
                style={{
                  width: "50px",
                  ...TYPOGRAPHY.caption["medium"],
                  color: COLORS.grayscale[700],
                }}
              >
                이름
              </div>
              <div>{artistData?.name}</div>
            </Flex>
            <Flex style={{ ...TYPOGRAPHY.body2["regular"] }}>
              <div
                style={{
                  width: "50px",
                  ...TYPOGRAPHY.caption["medium"],
                  color: COLORS.grayscale[700],
                }}
              >
                생년
              </div>
              <div>
                {artistData?.birthDate
                  ? artistData.birthDate.slice(0, 10)
                  : "알 수 없음"}
              </div>
            </Flex>
            <Flex style={{ ...TYPOGRAPHY.body2["regular"] }}>
              <div
                style={{
                  width: "50px",
                  ...TYPOGRAPHY.caption["medium"],
                  color: COLORS.grayscale[700],
                }}
              >
                신장
              </div>
              <div>
                {artistData?.height ? `${artistData.height} cm` : "알 수 없음"}
              </div>
            </Flex>
            <Flex style={{ ...TYPOGRAPHY.body2["regular"] }}>
              <div
                style={{
                  width: "50px",
                  ...TYPOGRAPHY.caption["medium"],
                  color: COLORS.grayscale[700],
                }}
              >
                체중
              </div>
              <div>
                {artistData?.weight ? `${artistData.weight} kg` : "알 수 없음"}
              </div>
            </Flex>
            <Flex style={{ ...TYPOGRAPHY.body2["regular"] }}>
              <div
                style={{
                  width: "50px",
                  ...TYPOGRAPHY.caption["medium"],
                  color: COLORS.grayscale[700],
                }}
              >
                특기
              </div>
              <div>
                {Array.isArray(artistData?.specialty)
                  ? artistData.specialty.join(", ")
                  : "없음"}
              </div>
            </Flex>
            <Flex style={{ ...TYPOGRAPHY.body2["regular"], marginBottom: 0 }}>
              <div
                style={{
                  width: "50px",
                  ...TYPOGRAPHY.caption["medium"],
                  color: COLORS.grayscale[700],
                }}
              >
                분야
              </div>
              <div style={{ display: "flex", gap: 6 }}>
                {artistData && artistData.genreList.length === 0 && "없음"}
                {artistData &&
                  artistData.genreList.length > 0 &&
                  artistData.genreList.map((genre, index) => (
                    <span
                      key={index}
                      style={{
                        ...TYPOGRAPHY.caption["medium"],
                        color: COLORS.grayscale[100],
                        backgroundColor: COLORS.primary[500],
                        padding: "2px 6px",
                      }}
                    >
                      {genre}
                    </span>
                  ))}
              </div>
            </Flex>
          </div>
        </div>
        <div
          style={{ padding: "0px 16px", width: "100%", marginBottom: "20px" }}
        >
          <div
            style={{
              ...TYPOGRAPHY.caption["medium"],
              color: COLORS.grayscale[700],
              marginBottom: "8px",
            }}
          >
            프로젝트
          </div>
          <FlexRow
            onClick={() => {
              setContextMenuOpen(!contextMenuOpen);
            }}
            style={{
              justifyContent: "space-between",
              border: `0.7px solid ${COLORS.grayscale[500]}`,
              padding: "18px 10px",
              position: "relative",
              cursor: "pointer",
            }}
          >
            <div
              style={{
                ...TYPOGRAPHY.body2["regular"],
              }}
            >
              {projectData?.title || "선택"}
            </div>
            <DownChevronIcon />
          </FlexRow>
        </div>
        <div style={{ padding: "0px 16px", width: "100%" }}>
          <div
            style={{
              ...TYPOGRAPHY.caption["medium"],
              color: COLORS.grayscale[700],
              marginBottom: "8px",
            }}
          >
            제안 메세지
          </div>
          <div
            style={{
              width: "100%",
              height: "343px",
              border: `0.7px solid ${COLORS.grayscale[500]}`,
              padding: "16px 10px",
            }}
          >
            <TextArea
              placeholder="메세지를 입력해주세요"
              value={artistData?.message || ""}
              onChange={(e) => setMessage(e.target.value)}
              disabled
            />
            <div
              style={{
                ...TYPOGRAPHY.caption["medium"],
                color: COLORS.grayscale[500],
              }}
            >
              {message.length}
              {" / 300"}
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default ArtistConnectionPage;

const Container = styled.main`
  background-color: white;
  width: 100%;
  min-height: 100vh;
  height: calc(var(--vh, 1vh) * 100);
  position: relative;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-direction: column;
  overflow-x: hidden;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  &::-webkit-scrollbar {
    display: none;
  }
  scrollbar-width: none;
  -ms-overflow-style: none; /* IE and Edge */
`;

const Title = styled.div``;

const Flex = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-bottom: 8px;
`;

const HeaderWithTitle = styled.div`
  width: 100%;
  height: 57px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 16px;
  flex-shrink: 0;
`;

const FlexRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
`;

const TextArea = styled.textarea`
  width: 100%;
  height: 285px;
  border: none;
  outline: none;
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  letter-spacing: -2%;
  color: ${COLORS.grayscale[900]};
  resize: none;
  &::placeholder {
    color: ${COLORS.grayscale[400]};
  }
`;
