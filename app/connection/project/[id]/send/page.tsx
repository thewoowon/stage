"use client";

import { COLORS } from "@/styles/color";
import { TYPOGRAPHY } from "@/styles/typography";
import { useUser } from "@/contexts/UserContext";
import styled from "@emotion/styled";
import { useRouter } from "next/navigation";
import { use, useState } from "react";
import { LeftChevronIcon } from "@/components/svg";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ProjectExtendedResponseType } from "@/type";
import customAxios from "@/lib/axios";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import toast from "react-hot-toast";

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

const ProjectConnectionPage = ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = use(params);
  const router = useRouter();
  const [message, setMessage] = useState("");

  const { data: projectData, isLoading: projectIsLoading } =
    useQuery<ProjectExtendedResponseType>({
      queryKey: ["project", id],
      queryFn: async () => {
        const response = await customAxios.get(`/api/project/getProject`, {
          params: { projectId: id },
        });

        if (response.status !== 200) {
          throw new Error("Network response was not ok");
        }

        return response.data;
      },
      enabled: !!id,
    });

  const { mutate: sendConnection } = useMutation({
    mutationFn: async () => {
      const response = await customAxios.post("/api/connect/connectProject", {
        projectId: id,
        message,
      });

      if (response.status !== 200) {
        throw new Error("Network response was not ok");
      }

      return response.data;
    },
    onSuccess: () => {
      router.push(`/search/project/${id}?status=connected`);
    },
    onError: (error) => {
      console.error("Error sending connection:", error);
      toast.error("연결을 보내는 중 오류가 발생했습니다. 다시 시도해주세요.");
    },
  });

  const handleSending = () => {
    if (message.length === 0) {
      toast.error("메세지를 입력해주세요.");
      return;
    }
    if (message.length > 300) {
      toast.error("메세지는 300자 이내로 작성해주세요.");
      return;
    }
    sendConnection();
  };

  if (!projectData || projectIsLoading) {
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
        <div style={{ padding: "0 16px", width: "100%" }}>
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
                분야
              </div>
              <div style={{ display: "flex", gap: 6 }}>
                <span
                  style={{
                    ...TYPOGRAPHY.caption["medium"],
                    color: COLORS.grayscale[100],
                    backgroundColor: COLORS.primary[500],
                    padding: "2px 6px",
                  }}
                >
                  {projectData?.genre.genreName}
                </span>
              </div>
            </Flex>
            <Flex
              style={{
                ...TYPOGRAPHY.body2["regular"],
                alignItems: "baseline",
              }}
            >
              <div
                style={{
                  width: "50px",
                  minWidth: "50px",
                  ...TYPOGRAPHY.caption["medium"],
                  color: COLORS.grayscale[700],
                }}
              >
                프로젝트
              </div>
              <div>{projectData?.title}</div>
            </Flex>
            <Flex style={{ ...TYPOGRAPHY.body2["regular"] }}>
              <div
                style={{
                  width: "50px",
                  ...TYPOGRAPHY.caption["medium"],
                  color: COLORS.grayscale[700],
                }}
              >
                마감일
              </div>
              <div>{projectData?.endDate}</div>
            </Flex>
            <Flex style={{ ...TYPOGRAPHY.body2["regular"] }}>
              <div
                style={{
                  width: "50px",
                  ...TYPOGRAPHY.caption["medium"],
                  color: COLORS.grayscale[700],
                }}
              >
                제작사
              </div>
              <div>{projectData?.company}</div>
            </Flex>
            <Flex style={{ ...TYPOGRAPHY.body2["regular"] }}>
              <div
                style={{
                  width: "50px",
                  ...TYPOGRAPHY.caption["medium"],
                  color: COLORS.grayscale[700],
                }}
              >
                캐스터
              </div>
              <div>{projectData?.name}</div>
            </Flex>
          </div>
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
        <Button onClick={handleSending}>연결 보내기</Button>
      </ButtonBox>
    </Container>
  );
};

export default ProjectConnectionPage;

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

const Title = styled.div`
  margin-bottom: 10px;
`;

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
