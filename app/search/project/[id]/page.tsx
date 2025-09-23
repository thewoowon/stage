"use client";
import styled from "@emotion/styled";
import { use, useEffect, useState } from "react";
import Image from "next/image";
import { LeftChevronIcon } from "@/components/svg";
import { useRouter, useSearchParams } from "next/navigation";
import { TYPOGRAPHY } from "@/styles/typography";
import { COLORS } from "@/styles/color";
import { useUser } from "@/contexts/UserContext";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { useQuery } from "@tanstack/react-query";
import customAxios from "@/lib/axios";
import { ProjectExtendedResponseType } from "@/type";

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

const ProjectPage = ({ params }: { params: Promise<{ id: string }> }) => {
  const searchParams = useSearchParams();
  const status = searchParams.get("status");
  const { id } = use(params);
  const router = useRouter();
  const { user } = useUser();
  const [open, setOpen] = useState(false);

  const { data: projectData, isLoading: projectIsLoading } =
    useQuery<ProjectExtendedResponseType>({
      queryKey: ["artist", id],
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

  const handleConnection = () => {
    router.push(`/connection/project/${id}/send`);
  };

  // /api/project/getProject

  useEffect(() => {
    if (status === "connected") {
      setOpen(true);
    }
  }, [status]);

  if (projectIsLoading || !projectData) {
    return (
      <Container>
        <HeaderWithTitle>
          <div
            onClick={() => router.back()}
            style={{ cursor: "pointer", position: "absolute", left: 16 }}
          >
            <LeftChevronIcon fill="#111111" />
          </div>
          <div>프로젝트명</div>
        </HeaderWithTitle>
        <ImageWrapper
          style={{
            backgroundColor: COLORS.grayscale[400],
          }}
        ></ImageWrapper>
        <div
          style={{
            width: "100%",
            flex: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <LoaderLottie />
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <HeaderWithTitle>
        <div
          onClick={() => router.back()}
          style={{ cursor: "pointer", position: "absolute", left: 16 }}
        >
          <LeftChevronIcon fill="#111111" />
        </div>
        <div>{projectData.title}</div>
      </HeaderWithTitle>
      <ImageWrapper
        style={{
          backgroundColor: COLORS.grayscale[400],
        }}
      >
        <Image
          src={projectData?.image}
          alt={projectData.title}
          fill
          sizes="100%"
          style={{ objectFit: "cover" }}
          priority
        />
      </ImageWrapper>
      <div style={{ padding: "20px 16px", width: "100%" }}>
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
          <div>{projectData.company}</div>
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
      <Divider />
      <div style={{ padding: "0 16px", width: "100%" }}>
        <Title
          style={{
            ...TYPOGRAPHY.h4["bold"],
          }}
        >
          상세 공고
        </Title>
        <div>{projectData?.content}</div>
      </div>
      {user?.category === 1 && (
        <ButtonWrapper>
          <ButtonBox>
            <Button onClick={handleConnection}>연결 보내기</Button>
          </ButtonBox>
        </ButtonWrapper>
      )}

      <Modal style={{ display: open ? "flex" : "none" }}>
        <MessageBox>
          <div>
            연결이 성공적으로
            <br />
            전송되었습니다
          </div>
          <MessageBoxButton
            style={{
              ...TYPOGRAPHY.body1.medium,
              backgroundColor: COLORS.grayscale[1100],
              color: COLORS.grayscale[100],
            }}
            onClick={() => {
              setOpen(false);
            }}
          >
            확인
          </MessageBoxButton>
        </MessageBox>
      </Modal>
    </Container>
  );
};

export default ProjectPage;

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

const HeaderWithTitle = styled.div`
  width: 100%;
  height: 57px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 16px;
  flex-shrink: 0;
`;

const ImageWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 164px;
  flex-shrink: 0;
`;

const Flex = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-bottom: 8px;
`;

const Divider = styled.div`
  width: 100%;
  height: 8px;
  background-color: #f4f4f4;
  margin: 16px 0;
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

const Title = styled.div`
  margin-bottom: 10px;
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 26px;
  // 스크롤 막기
  overflow: hidden;
`;

const MessageBox = styled.div`
  width: 324px;
  background-color: white;
  color: ${COLORS.grayscale[1300]};
  padding: 18px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  gap: 16px;
`;

const MessageBoxButton = styled.div`
  flex: 1;
  width: 100%;
  height: 46px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 12px 16px;
  cursor: pointer;
`;

const ButtonWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: absolute;
  bottom: 20px;
  gap: 12px;
`;
