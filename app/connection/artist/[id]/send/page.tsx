"use client";

import { LeftChevronIcon } from "@/components/svg";
import DownChevronIcon from "@/components/svg/DownChevronIcon";
import { useUser } from "@/contexts/UserContext";
import customAxios from "@/lib/axios";
import { COLORS } from "@/styles/color";
import { TYPOGRAPHY } from "@/styles/typography";
import { ArtistDetailResponseType } from "@/type";
import styled from "@emotion/styled";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { useMutation, useQuery } from "@tanstack/react-query";
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
  options: { value: string | number; label: string }[];
  selectedOption?: string | number | null;
  onSelect: (option: string | number) => void;
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
            key={option.value}
            onClick={(e) => {
              e.stopPropagation();
              onSelect(option.value);
            }}
            style={{
              ...TYPOGRAPHY.body2["regular"],
              backgroundColor:
                selectedOption === option.value ? COLORS.grayscale[400] : "",
            }}
          >
            {option.label}
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
  const [project, setProject] = useState<number | null>(null);
  const [message, setMessage] = useState("");
  const [contextMenuOpen, setContextMenuOpen] = useState(false);

  const { data, isLoading } = useQuery<ArtistDetailResponseType>({
    queryKey: ["artist", id],
    queryFn: async () => {
      const response = await customAxios.get(`/api/stage/getStage`, {
        params: { stageId: id },
      });

      if (response.status !== 200) {
        throw new Error("Network response was not ok");
      }

      return response.data;
    },
    enabled: !!id,
  });

  // 캐스터가 진행중인 프로젝트
  const { data: ongoingProjects } = useQuery<
    {
      id: number;
      title: string;
      image: string;
      genre: string;
      endDate: string;
    }[]
  >({
    queryKey: ["ongoingProjects", user?.id],
    queryFn: async () => {
      const response = await customAxios.get(
        "/api/project/getMyOpenProjectList"
      );

      if (response.status !== 200) {
        throw new Error("Network response was not ok");
      }

      return response.data;
    },
    // 캐스터만 가능하게 해야함.
    enabled: !!user?.id && user?.category === 2,
  });

  const { mutate: sendConnection } = useMutation({
    mutationFn: async () => {
      const response = await customAxios.post("/api/connect/connectArtist", {
        stageId: id,
        projectId: project,
        message,
      });

      if (response.status !== 200) {
        throw new Error("Network response was not ok");
      }

      return response.data;
    },
    onSuccess: () => {
      router.push(`/search/artist/${id}?status=connected`);
    },
    onError: (error) => {
      console.error("Error sending connection:", error);
      alert("연결을 보내는 중 오류가 발생했습니다. 다시 시도해주세요.");
    },
  });

  const handleSending = () => {
    if (!project) {
      alert("프로젝트를 선택해주세요.");
      return;
    }
    if (message.length === 0) {
      alert("메세지를 입력해주세요.");
      return;
    }
    if (message.length > 300) {
      alert("메세지는 300자 이내로 작성해주세요.");
      return;
    }
    sendConnection();
  };

  if (!data || isLoading) {
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
        <div style={{ padding: "0 16px", width: "100%", marginBottom: "40px" }}>
          <Title
            style={{
              ...TYPOGRAPHY.h3["bold"],
              color: "#111111",
            }}
          ></Title>
        </div>
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
            제안 메세지를 작성해 <br />
            연결을 보내보세요
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
              <div>{data.name}</div>
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
                {data.birthDate ? data.birthDate.slice(0, 10) : "알 수 없음"}
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
              <div>{data.weight ? `${data.weight} cm` : "알 수 없음"}</div>
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
              <div>{data.weight ? `${data.weight} kg` : "알 수 없음"}</div>
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
                {Array.isArray(data.specialty)
                  ? data.specialty.join(", ")
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
                {data.genreList.length === 0 && "없음"}
                {data.genreList.length > 0 &&
                  data.genreList.map((genre, index) => (
                    <span
                      key={index}
                      style={{
                        ...TYPOGRAPHY.caption["medium"],
                        color: COLORS.grayscale[100],
                        backgroundColor: COLORS.primary[500],
                        padding: "2px 6px",
                      }}
                    >
                      {genre.genreName}
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
              {ongoingProjects?.find((proj) => proj.id === project)?.title ||
                "선택"}
            </div>
            <DownChevronIcon />
            <SortOptionsContextMenu
              open={contextMenuOpen}
              options={
                ongoingProjects?.map((proj) => {
                  return { value: proj.id, label: proj.title };
                }) || []
              }
              selectedOption={project}
              onSelect={(option) => {
                setProject(option as number);
                setContextMenuOpen(false);
              }}
              onClose={() => {
                setContextMenuOpen(false);
              }}
            />
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
              value={message}
              onChange={(e) => setMessage(e.target.value)}
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
      <ButtonBox>
        <Button
          onClick={handleSending}
          disabled={!project || message.length === 0 || message.length > 300}
        >
          연결 보내기
        </Button>
      </ButtonBox>
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

const ButtonBox = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  gap: 12px;
  padding-left: 16px;
  padding-right: 16px;
  margin-bottom: 20px;
  margin-top: 12px;
`;

const Button = styled.button`
  z-index: 1;
  width: 100%;
  height: 48px;
  background-color: ${COLORS.primary[500]};
  color: ${COLORS.grayscale[100]};
  border: none;
  font-size: 16px;
  font-weight: 600;
  line-height: 20px;
  letter-spacing: -2%;
  transition: background-color 0.2s ease-in-out;
  cursor: pointer;

  &:hover {
    background-color: ${COLORS.primary[600]};
  }

  &:disabled {
    background-color: ${COLORS.grayscale[200]};
    color: ${COLORS.grayscale[500]};
    cursor: not-allowed;
  }
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
