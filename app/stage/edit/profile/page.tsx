"use client";
import styled from "@emotion/styled";
import Image from "next/image";
import { LeftChevronIcon, XIcon } from "@/components/svg";
import { useRouter } from "next/navigation";
import { TYPOGRAPHY } from "@/styles/typography";
import { COLORS } from "@/styles/color";
import { useUser } from "@/contexts/UserContext";
import CameraIcon from "@/components/svg/CameraIcon";
import { useMutation, useQuery } from "@tanstack/react-query";
import customAxios from "@/lib/axios";
import { ArtistDetailResponseType } from "@/type";
import { useEffect, useRef, useState } from "react";
import DownChevronIcon from "@/components/svg/DownChevronIcon";
import { GENRE_LIST } from "@/constants";
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

const AFFILIATION_OPTIONS = [
  { value: 1, label: "소속" },
  { value: 2, label: "무소속" },
];

const MultiSortOptionsContextMenu = ({
  open,
  options,
  selectedOptions,
  onSelect,
}: {
  open: boolean;
  options: { value: number; label: string }[];
  selectedOptions?: number[] | null;
  onSelect: (option: number) => void;
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
              backgroundColor: selectedOptions?.includes(option.value)
                ? COLORS.grayscale[400]
                : "",
            }}
          >
            {option.label}
          </ContextMenuItem>
        ))}
    </ContextMenuContainer>
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

const ProfileEditPage = () => {
  const router = useRouter();
  const { user } = useUser();
  const [artist, setArtist] = useState<ArtistDetailResponseType>({
    id: 0,
    name: "",
    grade: "",
    score: "",
    instagramLink: "",
    youtubeLink: "",
    birthDate: "",
    weight: "",
    height: "",
    categoryCode: "",
    categoryName: "",
    specialty: "",
    genreList: [],
    snsList: [],
    portfolioList: [],
    artistList: [],
    image: "",
  });
  const [caster, setCaster] = useState<string>("");
  const [contextMenuOpen1, setContextMenuOpen1] = useState(false);
  const [contextMenuOpen2, setContextMenuOpen2] = useState(false);
  // 소속여부
  const [affiliation, setAffiliation] = useState<number>(0);
  const [file, setFile] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [myUploadUrl, setMyUploadUrl] = useState<string | null>(null);
  const [, setOverLimit] = useState(false);

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

  const { data: myStageData, isLoading: isMyStageLoading } =
    useQuery<ArtistDetailResponseType>({
      queryKey: ["myStage"],
      queryFn: async () => {
        const response = await customAxios.get(
          `/api/stage/getMyArtistStage`,
          {}
        );
        if (response.status !== 200) {
          throw new Error("프로필 정보를 가져오는 데 실패했습니다.");
        }

        return response.data;
      },
      staleTime: 5 * 60 * 1000, // 5분
      enabled: !!user && user.category === 1, // user가 있을 때만 실행
    });

  const { mutate: mutateArtist } = useMutation({
    mutationFn: async (artistData: ArtistDetailResponseType) => {
      const formData = new FormData();
      formData.append("file", file as File);
      formData.append(
        "stageData",
        JSON.stringify({
          genreList: artistData.genreList?.map((genre) => genre.genreId) || [],
          height: artistData.height || "",
          name: artistData.name || "",
          instagramLink: artistData.instagramLink || "",
          birthDate: artistData.birthDate || "",
          affiliation: AFFILIATION_OPTIONS.find(
            (option) => option.value === affiliation
          )?.label,
          weight: artistData.weight || "",
          id: artistData.id || 0,
          youtubeLink: artistData.youtubeLink || "",
          specialty: artistData.specialty || "",
        })
      );

      const response = await customAxios.put(
        "/api/stage/updateStage",
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
      toast.success("프로필이 성공적으로 업데이트되었습니다.");
      router.replace("/stage");
    },
    onError: (error) => {
      console.error(error);
      toast.error("프로필 업데이트 중 오류가 발생했습니다. 다시 시도해주세요.");
    },
  });

  const { mutate: mutateCaster } = useMutation({
    mutationFn: async (artistData: ArtistDetailResponseType) => {
      const formData = new FormData();
      formData.append("file", file as File);
      formData.append(
        "stageData",
        JSON.stringify({
          name: artistData.name || "",
          affiliation: caster || "",
        })
      );

      const response = await customAxios.put(
        "/api/stage/updateStage",
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
      toast.success("프로필이 성공적으로 업데이트되었습니다.");
      router.replace("/stage");
    },
    onError: (error) => {
      console.error(error);
      toast.error("프로필 업데이트 중 오류가 발생했습니다. 다시 시도해주세요.");
    },
  });

  const handleUpdate = () => {
    if (!user) {
      toast.error("로그인이 필요합니다.");
      router.replace("/");
      return;
    }
    if (user.category === 1) {
      if (!artist) {
        toast.error("프로필 정보를 불러오는 중입니다. 잠시만 기다려주세요.");
        return;
      }
      // 아티스트라면...
      if (!artist.name || artist.name.trim() === "") {
        toast.error("이름을 입력해주세요.");
        return;
      }
      if (!artist.birthDate || artist.birthDate.trim() === "") {
        toast.error("생년월일을 입력해주세요.");
        return;
      }
      if (!artist.height || artist.height.trim() === "") {
        toast.error("신장을 입력해주세요.");
        return;
      }
      if (!artist.weight || artist.weight.trim() === "") {
        toast.error("체중을 입력해주세요.");
        return;
      }
      if (affiliation === 0) {
        toast.error("소속여부를 선택해주세요.");
        return;
      }
      if (!artist.specialty || artist.specialty.trim() === "") {
        toast.error("특기를 입력해주세요.");
        return;
      }
      if (!artist.genreList || artist.genreList.length === 0) {
        toast.error("분야를 선택해주세요.");
        return;
      }

      mutateArtist(artist);
    } else if (user.category === 2) {
      if (!caster || caster.trim() === "") {
        toast.error("소속을 입력해주세요.");
        return;
      }
      mutateCaster(artist);
    } else {
      console.error("알 수 없는 사용자 카테고리:", user.category);
      return;
    }
  };

  useEffect(() => {
    if (myStageData) {
      setArtist({
        id: myStageData.id,
        name: myStageData.name,
        grade: myStageData.grade || "",
        score: myStageData.score || "",
        instagramLink: myStageData.instagramLink || "",
        youtubeLink: myStageData.youtubeLink || "",
        birthDate: myStageData.birthDate || "",
        weight: myStageData.weight || "",
        height: myStageData.height || "",
        categoryCode: myStageData.categoryCode || "",
        categoryName: myStageData.categoryName || "",
        specialty: myStageData.specialty || "",
        genreList: myStageData.genreList || [],
        image: myStageData.image || "",
        snsList: myStageData.snsList || [],
        portfolioList: myStageData.portfolioList || [],
        artistList: myStageData.artistList || [],
      });
    }
  }, [myStageData]);

  if (!user) {
    return <div>로그인이 필요합니다.</div>;
  }

  if (user.category === 1) {
    if (isMyStageLoading) {
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
          ) : artist.image ? (
            <Image
              src={artist.image}
              alt={"Profile Image"}
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
            padding: "30px 16px 100px 16px",
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
              이름
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
                placeholder="이름을 입력해주세요"
                value={artist.name}
                onChange={(e) => {
                  setArtist({ ...artist, name: e.target.value });
                }}
              />
            </FlexRow>
          </div>
          <div style={{ width: "100%" }}>
            <div
              style={{
                ...TYPOGRAPHY.caption["medium"],
                color: COLORS.grayscale[700],
                marginBottom: "10px",
              }}
            >
              Instagram 링크
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
                placeholder="인스타그랩 링크를 입력해주세요."
                value={artist.instagramLink || ""}
                onChange={(e) => {
                  setArtist({ ...artist, instagramLink: e.target.value });
                }}
              />
            </FlexRow>
          </div>
          <div style={{ width: "100%" }}>
            <div
              style={{
                ...TYPOGRAPHY.caption["medium"],
                color: COLORS.grayscale[700],
                marginBottom: "10px",
              }}
            >
              Youtube 링크
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
                placeholder="유튜브 채널주소를 입력해주세요"
                value={artist.youtubeLink || ""}
                onChange={(e) => {
                  setArtist({ ...artist, youtubeLink: e.target.value });
                }}
              />
            </FlexRow>
          </div>
          <div style={{ width: "100%" }}>
            <div
              style={{
                ...TYPOGRAPHY.caption["medium"],
                color: COLORS.grayscale[700],
                marginBottom: "10px",
              }}
            >
              생년월일
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
                placeholder="생년월일을 입력해주세요"
                value={artist.birthDate}
                onChange={(e) => {
                  setArtist({ ...artist, birthDate: e.target.value });
                }}
              />
            </FlexRow>
          </div>
          <div style={{ width: "100%" }}>
            <div
              style={{
                ...TYPOGRAPHY.caption["medium"],
                color: COLORS.grayscale[700],
                marginBottom: "10px",
              }}
            >
              신장
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
                placeholder="신장을 입력해주세요"
                value={artist.height || ""}
                onChange={(e) => {
                  setArtist({ ...artist, height: e.target.value });
                }}
              />
            </FlexRow>
          </div>
          <div style={{ width: "100%" }}>
            <div
              style={{
                ...TYPOGRAPHY.caption["medium"],
                color: COLORS.grayscale[700],
                marginBottom: "10px",
              }}
            >
              체중
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
                placeholder="체중을 입력해주세요"
                value={artist.weight || ""}
                onChange={(e) => {
                  setArtist({ ...artist, weight: e.target.value });
                }}
              />
            </FlexRow>
          </div>
          <div style={{ width: "100%" }}>
            <div
              style={{
                ...TYPOGRAPHY.caption["medium"],
                color: COLORS.grayscale[700],
                marginBottom: "10px",
              }}
            >
              소속여부
            </div>
            <FlexRow
              onClick={() => {
                setContextMenuOpen1(!contextMenuOpen1);
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
                {AFFILIATION_OPTIONS.find(
                  (option) => option.value === affiliation
                )?.label || "선택"}
              </div>
              <DownChevronIcon />
              <SortOptionsContextMenu
                open={contextMenuOpen1}
                options={AFFILIATION_OPTIONS}
                selectedOption={affiliation}
                onSelect={(option) => {
                  setAffiliation(option as number);
                  setContextMenuOpen1(false);
                }}
                onClose={() => {
                  setContextMenuOpen1(false);
                }}
              />
            </FlexRow>
          </div>
          <div style={{ width: "100%" }}>
            <div
              style={{
                ...TYPOGRAPHY.caption["medium"],
                color: COLORS.grayscale[700],
                marginBottom: "10px",
              }}
            >
              특기
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
                placeholder="특기를 입력해주세요"
                value={artist.specialty || ""}
                onChange={(e) => {
                  setArtist({
                    ...artist,
                    specialty: e.target.value,
                  });
                }}
              />
            </FlexRow>
          </div>
          <div style={{ width: "100%" }}>
            <div
              style={{
                ...TYPOGRAPHY.caption["medium"],
                color: COLORS.grayscale[700],
                marginBottom: "10px",
              }}
            >
              분야
            </div>
            <FlexRow
              onClick={() => {
                setContextMenuOpen2(!contextMenuOpen2);
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
                {artist.genreList
                  ? artist.genreList.map((genre) => {
                      return (
                        <div
                          key={genre.genreId}
                          style={{
                            color: COLORS.grayscale[100],
                            backgroundColor: COLORS.grayscale[700],
                            ...TYPOGRAPHY.caption["medium"],
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 4,
                            marginRight: 8,
                            padding: "1px 6px",
                          }}
                        >
                          {genre.genreName}
                          <div
                            onClick={(e) => {
                              e.stopPropagation();
                              // 선택된 옵션 제거
                              setArtist({
                                ...artist,
                                genreList: artist.genreList?.filter(
                                  (g) => g.genreId !== genre.genreId
                                ),
                              });
                            }}
                            style={{ cursor: "pointer" }}
                          >
                            <XIcon width={16} height={16} />
                          </div>
                        </div>
                      );
                    })
                  : "선택"}
              </div>
              <DownChevronIcon />
              <MultiSortOptionsContextMenu
                open={contextMenuOpen2}
                options={GENRE_LIST.map((genre) => ({
                  value: genre.genreId,
                  label: genre.genreName,
                }))}
                selectedOptions={
                  artist.genreList?.map((genre) => genre.genreId) || []
                }
                onSelect={(option) => {
                  if (
                    artist.genreList?.some((genre) => genre.genreId === option)
                  ) {
                    // 이미 선택된 옵션이면 제거
                    setArtist({
                      ...artist,
                      genreList: artist.genreList?.filter(
                        (genre) => genre.genreId !== option
                      ),
                    });
                  } else {
                    // 선택되지 않은 옵션이면 추가
                    const selectedGenre = GENRE_LIST.find(
                      (genre) => genre.genreId === option
                    );
                    if (selectedGenre) {
                      setArtist({
                        ...artist,
                        genreList: [...(artist.genreList || []), selectedGenre],
                      });
                    }
                  }
                  setContextMenuOpen2(false);
                }}
                onClose={() => {
                  setContextMenuOpen2(false);
                }}
              />
            </FlexRow>
          </div>
        </div>
        <ButtonBox>
          <Button onClick={handleUpdate}>저장</Button>
        </ButtonBox>
      </Container>
    );
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
        ) : artist.image ? (
          <Image
            src={artist.image}
            alt={"Profile Image"}
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
            이름
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
              placeholder="이름을 입력해주세요"
              value={user.name}
              onChange={(e) => {
                console.log(e.target.value);
                return;
              }}
            />
          </FlexRow>
        </div>
      </div>
      <div
        style={{
          width: "100%",
          padding: "0px 16px",
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
            소속
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
              placeholder="소속을 입력해주세요"
              value={caster}
              onChange={(e) => {
                setCaster(e.target.value);
              }}
            />
          </FlexRow>
        </div>
      </div>
      <ButtonBox>
        <Button onClick={handleUpdate}>저장</Button>
      </ButtonBox>
    </Container>
  );
};

export default ProfileEditPage;

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

const FlexRow = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
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
