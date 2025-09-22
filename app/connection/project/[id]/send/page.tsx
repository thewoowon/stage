"use client";

import { PROJECT_DATA } from "@/components/view/SearchMainView";
import { COLORS } from "@/styles/color";
import { TYPOGRAPHY } from "@/styles/typography";
import { useUser } from "@/contexts/UserContext";
import styled from "@emotion/styled";
import { useRouter } from "next/navigation";
import { use, useState } from "react";
import { LeftChevronIcon } from "@/components/svg";

const ProjectConnectionPage = ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = use(params);
  const router = useRouter();
  const { user } = useUser();
  const [message, setMessage] = useState("");

  const project = PROJECT_DATA.find((project) => project.id === Number(id));
  if (!project) {
    return <div>Project not found</div>;
  }

  const handleSending = () => {
    router.replace(`/search/project/${id}?status=connected`);
    return;
    if (user.category === 1) {
      window.location.href =
        "https://accounts.google.com/o/oauth2/v2/auth?client_id=YOUR_CLIENT_ID&redirect_uri=YOUR_REDIRECT_URI&response_type=code&scope=email%20profile&access_type=offline&prompt=consent";
    } else {
      router.push(`/connection/artist/${id}/send`);
    }
  };

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
              <div>{project.title}</div>
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

const Input = styled.input`
  width: 100%;
  height: 100%;
  border: none;
  outline: none;
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  letter-spacing: -2%;
  color: ${COLORS.grayscale[900]};
  &::placeholder {
    color: ${COLORS.grayscale[400]};
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
