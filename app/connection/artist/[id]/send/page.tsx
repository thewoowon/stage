"use client";

import { LeftChevronIcon } from "@/components/svg";
import DownChevronIcon from "@/components/svg/DownChevronIcon";
import { ARTIST_DATA } from "@/components/view/SearchMainView";
import { useUser } from "@/contexts/UserContext";
import { COLORS } from "@/styles/color";
import { TYPOGRAPHY } from "@/styles/typography";
import styled from "@emotion/styled";
import { useRouter } from "next/navigation";
import { use, useState } from "react";

const SortOptionsContextMenu = ({
  open,
  options,
  selectedOption,
  onSelect,
  onClose,
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
      {options.map((option) => (
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
  const PROJECT_OPTIONS = ["프로젝트 1", "프로젝트 2"];
  const [open, setOpen] = useState(false);

  const artist = ARTIST_DATA.find((artist) => artist.id === Number(id));
  if (!artist) {
    return <div>Artist not found</div>;
  }

  const handleSending = () => {
    router.replace(`/search/artist/${id}?status=connected`);
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
        <div style={{ padding: "0 16px", width: "100%", marginBottom: "40px" }}>
          <Title
            style={{
              ...TYPOGRAPHY.h3["bold"],
              color: "#111111",
            }}
          >
            제안 메시지를 작성해 <br />
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
              <div>{artist.name}</div>
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
              <div>{artist.birthDate}</div>
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
              <div>{artist.height} cm</div>
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
              <div>{artist.weight} kg</div>
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
                {Array.isArray(artist.specialty)
                  ? artist.specialty.join(", ")
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
                {artist.tags.map((tag, index) => (
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
              {project || "선택"}
            </div>
            <DownChevronIcon />
            <SortOptionsContextMenu
              open={contextMenuOpen}
              options={PROJECT_OPTIONS}
              selectedOption={project}
              onSelect={(option) => {
                setProject(option);
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
            제안 메시지
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
