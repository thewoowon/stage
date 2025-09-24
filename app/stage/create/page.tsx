"use client";
import styled from "@emotion/styled";
import Image from "next/image";
import { LeftChevronIcon } from "@/components/svg";
import { useRouter } from "next/navigation";
import { TYPOGRAPHY } from "@/styles/typography";
import { COLORS } from "@/styles/color";
import { useUser } from "@/contexts/UserContext";
import CameraIcon from "@/components/svg/CameraIcon";
import { useMutation } from "@tanstack/react-query";
import customAxios from "@/lib/axios";
import { useRef, useState } from "react";
import DownChevronIcon from "@/components/svg/DownChevronIcon";
import { GENRE_LIST } from "@/constants";
import toast from "react-hot-toast";

const OptionsContextMenu = ({
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

const ProjectCreatePage = () => {
  const router = useRouter();
  const { user } = useUser();
  const [contextMenuOpen, setContextMenuOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [myUploadUrl, setMyUploadUrl] = useState<string | null>(null);
  const [, setOverLimit] = useState(false);

  const [projectForm, setProjectForm] = useState({
    projectName: "",
    category: 0,
    deadline: "",
    company: "",
    detailAnnouncement: "",
  });

  // /api/project/createProject
  const createProjectMutation = useMutation({
    mutationFn: async () => {
      const formData = new FormData();
      formData.append("file", file as File);
      formData.append(
        "projectData",
        JSON.stringify({
          title: projectForm.projectName,
          genre: projectForm.category,
          endDate: projectForm.deadline,
          company: projectForm.company,
          content: projectForm.detailAnnouncement,
        })
      );
      const response = await customAxios.post(
        "/api/project/createProject",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.status !== 200) {
        throw new Error("프로필 업데이트에 실패했습니다.");
      }
      return response.data;
    },
    onSuccess: () => {
      toast.success("프로젝트가 생성되었습니다.");
      router.push(`/stage`);
    },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    onError: (error) => {
      toast.error("프로젝트 생성에 실패했습니다.");
    },
  });

  const encodeFileToBase64 = (fileBlob: File) => {
    const reader = new FileReader();
    reader.readAsDataURL(fileBlob);
    return new Promise<void>((resolve) => {
      reader.onload = () => {
        setMyUploadUrl(reader.result?.toString() || "");
        resolve();
      };
    });
  };

  const handleCreate = () => {
    if (!user) {
      toast.error("로그인이 필요합니다.");
      router.replace("/");
      return;
    }

    if (projectForm.projectName.trim() === "") {
      toast.error("프로젝트명을 입력해주세요.");
      return;
    }

    if (projectForm.category === 0) {
      toast.error("카테고리를 선택해주세요.");
      return;
    }

    if (projectForm.deadline.trim() === "") {
      toast.error("마감일을 입력해주세요.");
      return;
    }

    if (projectForm.company.trim() === "") {
      toast.error("제작사를 입력해주세요.");
      return;
    }

    if (projectForm.detailAnnouncement.trim() === "") {
      toast.error("상세 공고를 입력해주세요.");
      return;
    }

    createProjectMutation.mutate();
  };

  if (!user) {
    return <div>로그인이 필요합니다.</div>;
  }

  return (
    <Container>
      <ShadowHeader>
        <div
          onClick={() => router.back()}
          style={{ cursor: "pointer", left: 16, position: "absolute" }}
        >
          <LeftChevronIcon fill={COLORS.grayscale[100]} />
        </div>
        <div
          style={{
            ...TYPOGRAPHY.body1["semiBold"],
            color: COLORS.grayscale[100],
          }}
        >
          프로필 편집
        </div>
      </ShadowHeader>
      <ImageWrapper
        style={{
          backgroundColor: COLORS.grayscale[400],
        }}
      >
        <FileInput
          ref={inputRef}
          type="file"
          accept="image/png, image/jpeg, image/jpg"
          onChange={async (e) => {
            const file = e.target.files?.[0];
            if (file) {
              // file size check 50MB
              if (file.size > 50 * 1024 * 1024) {
                setOverLimit?.(true);
                return;
              }

              setFile(file);

              await encodeFileToBase64(file);
            }
          }}
        />
        {myUploadUrl ? (
          <Image
            src={myUploadUrl}
            alt={"Uploaded Image"}
            fill
            sizes="100%"
            style={{ objectFit: "cover" }}
            priority
          />
        ) : null}
        <CameraIconBox
          onClick={(e) => {
            e.stopPropagation();
            inputRef.current?.click();
          }}
        >
          <CameraIcon />
        </CameraIconBox>
      </ImageWrapper>
      <div
        style={{
          width: "100%",
          padding: "30px 16px 16px 16px",
          display: "flex",
          flexDirection: "column",
          gap: "16px",
        }}
      >
        <div style={{ width: "100%" }}>
          <div
            style={{
              ...TYPOGRAPHY.caption["medium"],
              color: COLORS.grayscale[700],
              marginBottom: "10px",
            }}
          >
            프로젝트
          </div>
          <FlexRow
            style={{
              height: "44px",
              border: `0.7px solid ${COLORS.grayscale[500]}`,
              position: "relative",
              cursor: "pointer",
            }}
          >
            <CustomInput
              style={{
                ...TYPOGRAPHY.body2["regular"],
                paddingLeft: "10px",
              }}
              placeholder="프로젝트명을 입력해주세요"
              value={projectForm.projectName}
              onChange={(e) => {
                setProjectForm((prev) => ({
                  ...prev,
                  projectName: e.target.value,
                }));
              }}
            />
          </FlexRow>
        </div>
      </div>
      <div
        style={{
          width: "100%",
          padding: "16px",
          display: "flex",
          flexDirection: "column",
          gap: "16px",
        }}
      >
        <div style={{ width: "100%" }}>
          <div
            style={{
              ...TYPOGRAPHY.caption["medium"],
              color: COLORS.grayscale[700],
              marginBottom: "10px",
            }}
          >
            카테고리
          </div>
          <FlexRow
            onClick={() => {
              setContextMenuOpen(!contextMenuOpen);
            }}
            style={{
              height: "44px",
              justifyContent: "space-between",
              border: `0.7px solid ${COLORS.grayscale[500]}`,
              padding: "0px 10px",
              position: "relative",
              cursor: "pointer",
            }}
          >
            <div
              style={{
                ...TYPOGRAPHY.body2["regular"],
              }}
            >
              {GENRE_LIST.map((genre) => {
                return { value: genre.genreId, label: genre.genreName };
              }).find((option) => option.value === projectForm.category)
                ?.label || "선택"}
            </div>
            <DownChevronIcon />
            <OptionsContextMenu
              open={contextMenuOpen}
              options={GENRE_LIST.map((genre) => {
                return { value: genre.genreId, label: genre.genreName };
              })}
              selectedOption={projectForm.category}
              onSelect={(option) => {
                setProjectForm((prev) => ({
                  ...prev,
                  category: Number(option),
                }));
                setContextMenuOpen(false);
              }}
              onClose={() => {
                setContextMenuOpen(false);
              }}
            />
          </FlexRow>
        </div>
      </div>
      <div
        style={{
          width: "100%",
          padding: "16px",
          display: "flex",
          flexDirection: "column",
          gap: "16px",
        }}
      >
        <div style={{ width: "100%" }}>
          <div
            style={{
              ...TYPOGRAPHY.caption["medium"],
              color: COLORS.grayscale[700],
              marginBottom: "10px",
            }}
          >
            마감일
          </div>
          <FlexRow
            style={{
              height: "44px",
              border: `0.7px solid ${COLORS.grayscale[500]}`,
              position: "relative",
              cursor: "pointer",
            }}
          >
            <CustomInput
              style={{
                ...TYPOGRAPHY.body2["regular"],
                paddingLeft: "10px",
              }}
              placeholder="마감일을 입력해주세요"
              value={projectForm.deadline}
              onChange={(e) => {
                setProjectForm((prev) => ({
                  ...prev,
                  deadline: e.target.value,
                }));
              }}
            />
          </FlexRow>
        </div>
      </div>
      <div
        style={{
          width: "100%",
          padding: "16px",
          display: "flex",
          flexDirection: "column",
          gap: "16px",
        }}
      >
        <div style={{ width: "100%" }}>
          <div
            style={{
              ...TYPOGRAPHY.caption["medium"],
              color: COLORS.grayscale[700],
              marginBottom: "10px",
            }}
          >
            제작사
          </div>
          <FlexRow
            style={{
              height: "44px",
              border: `0.7px solid ${COLORS.grayscale[500]}`,
              position: "relative",
              cursor: "pointer",
            }}
          >
            <CustomInput
              style={{
                ...TYPOGRAPHY.body2["regular"],
                paddingLeft: "10px",
              }}
              placeholder="제작사를 입력해주세요"
              value={projectForm.company}
              onChange={(e) => {
                setProjectForm((prev) => ({
                  ...prev,
                  company: e.target.value,
                }));
              }}
            />
          </FlexRow>
        </div>
      </div>
      <div
        style={{
          width: "100%",
          padding: "16px",
          display: "flex",
          flexDirection: "column",
          gap: "16px",
        }}
      >
        <div style={{ width: "100%" }}>
          <div
            style={{
              ...TYPOGRAPHY.caption["medium"],
              color: COLORS.grayscale[700],
              marginBottom: "10px",
            }}
          >
            상세 공고
          </div>
          <FlexRow
            style={{
              border: `0.7px solid ${COLORS.grayscale[500]}`,
              position: "relative",
              cursor: "pointer",
            }}
          >
            <CustomTextArea
              style={{
                ...TYPOGRAPHY.body2["regular"],
                paddingLeft: "10px",
              }}
              placeholder="상세 공고를 입력해주세요"
              value={projectForm.detailAnnouncement}
              onChange={(e) => {
                setProjectForm((prev) => ({
                  ...prev,
                  detailAnnouncement: e.target.value,
                }));
              }}
            />
          </FlexRow>
        </div>
      </div>
      <ButtonBox>
        <Button onClick={handleCreate}>프로젝트 생성하기</Button>
      </ButtonBox>
    </Container>
  );
};

export default ProjectCreatePage;

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

const ShadowHeader = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 57px;
  z-index: 10;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 16px;
  background: linear-gradient(
    180deg,
    rgba(0, 0, 0, 0.15) 0%,
    rgba(0, 0, 0, 0) 100%
  );
`;

const ImageWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 248px;
  flex-shrink: 0;
`;

const CustomInput = styled.input`
  all: unset;
  width: 100%;
  box-sizing: border-box;
  padding: 0;
  margin: 0;
  &::placeholder {
    color: ${COLORS.grayscale[500]};
  }
`;

const CustomTextArea = styled.textarea`
  all: unset;
  width: 100%;
  height: 260px;
  box-sizing: border-box;
  padding: 10px;
  margin: 0;
  resize: none;
  &::placeholder {
    color: ${COLORS.grayscale[500]};
  }
`;

const FlexRow = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
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

const CameraIconBox = styled.div`
  position: absolute;
  bottom: 16px;
  right: 16px;
  z-index: 10;
  background-color: white;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
`;

const ButtonBox = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  gap: 12px;
  padding-top: 24px;
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

const FileInput = styled.input`
  display: none;
`;
