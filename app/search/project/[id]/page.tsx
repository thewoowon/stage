"use client";
import styled from "@emotion/styled";
import { use, useEffect, useState } from "react";
import Image from "next/image";
import { PROJECT_DATA } from "@/components/view/SearchMainView";
import { LeftChevronIcon } from "@/components/svg";
import { useRouter, useSearchParams } from "next/navigation";
import { TYPOGRAPHY } from "@/styles/typography";
import { COLORS } from "@/styles/color";
import { useUser } from "@/contexts/UserContext";

const ProjectPage = ({ params }: { params: Promise<{ id: string }> }) => {
  const searchParams = useSearchParams();
  const status = searchParams.get("status");
  const { id } = use(params);
  const router = useRouter();
  const { user } = useUser();
  const [open, setOpen] = useState(false);

  const project = PROJECT_DATA.find((project) => project.id === Number(id));

  useEffect(() => {
    if (status === "connected") {
      setOpen(true);
    }
  }, [status]);

  if (!project) {
    return <div>Project not found</div>;
  }

  const handleConnection = () => {
    router.push(`/connection/project/${id}/send`);
    return;
    if (user.role === "AR") {
      window.location.href =
        "https://accounts.google.com/o/oauth2/v2/auth?client_id=YOUR_CLIENT_ID&redirect_uri=YOUR_REDIRECT_URI&response_type=code&scope=email%20profile&access_type=offline&prompt=consent";
    } else {
      router.push(`/connection/artist/${id}/send`);
    }
  };

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
          backgroundColor: COLORS.grayscale[200],
        }}
      >
        <Image
          src={project.thumbnailImage}
          alt={project.title}
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
            {project.tags.map((tag, index) => (
              <span
                key={index}
                style={{
                  ...TYPOGRAPHY.caption["medium"],
                  color: COLORS.grayscale[100],
                  backgroundColor: COLORS.primary[500],
                  padding: "2px 6px",
                }}
              >
                {tag}
              </span>
            ))}
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
          <div>{project.deadline}</div>
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
          <div>{project.company}</div>
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
          <div>{project.caster}</div>
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
        <div>
          {`
            2025 OTT 장편영화 <웅> 배우 공개 오디션 공고

            <기본 개요>
            장르 : 사회 서스펜스 드라마
            제작사 : 주식회사 피에치이엔엠 (PH E&M)
            촬영 시기 : 2025년 하반기 (9월 예정)

            <오디션 일정>
            서류 지원 마감 : 2025년 10월 09일(화) 23시 59분까지

            1차 서류 심사 : 2025년 10월 14일(수)
            2차 현장 오디션 : 2025년 11월 1일(금) ~ 2025년 11월 29일(일)

            ※ 최종합격자 발표 및 캐스팅 계약은 개별 협의

            <모집배역>
            1. 우진 (남, 20대) - 구멍가게집 아들. 순수하지만 거친 성격, 행동이 앞서는 인물
            2. 진수 (남, 20대) - 우진의 친구. 정직적인 순박한 성 청년
            3. 수진 (여, 20대) - 이장의 딸. 섬 세고 미모, 따뜻하고 살가운 성격. 육지에 대한 동경을 가진 인물
            4. 명환 (남, 40대) - 섬마을 뱃사공. 안경을 쓴 고지식한 성격. 틀에 박힌 일상
            5. 재숙 (여, 40대 후반) - 우진의 어머니. 마르고 단단한 인상. 강단 있는 여성
            6. 혜옥 (여, 40대) - 민박집 운영자. 말 많고 현실적인 타입. 생계에 민감함
            7. 동철 (남, 50대) - 의지인. 박사같은 지적 이미지와 묘한 눈빛을 가진 인물
            8. 태홍 (남, 50대) - 마을 이장. 웃는 얼굴 뒤로 긴장감이 느껴지는 부드러운 카리스마

            <지원방법>
            온라인 지원링크 : https://forms.gle/7QXQksnjwWYezmn89
            ※ 위 제공된 온라인 지원서에 맞춰서 지원 신청 요망

            <유의사항>
            - 서류 및 오디션 결과는 작성된 이메일을 통해 개별적으로 안내드릴 예정입니다.
            - 본 오디션은 PH E&M이 제작하는 다른 콘텐츠에서도 향후 캐스팅 참조 자료로 활용될 수 있습니다.
            - 오디션 지원은 링크를 통해서만 받고 있으며, 문의사항은 contact@phenm.com 으로 문의해주시기 바랍니다.

            본 프로젝트와 함께 걸어 있는 서사를 만들어갈
            역량 있는 배우 여러분의 많은 관심과 지원을 기다립니다.
            감사합니다.
            `}
        </div>
      </div>
      <Divider />
      {user.role === "AR" && (
        <ButtonBox>
          <Button onClick={handleConnection}>연결 보내기</Button>
        </ButtonBox>
      )}
      <Modal style={{ display: open ? "flex" : "none" }}>
        <MessageBox>
          <div>
            연결이 성공적으로<br />
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
