"use client";
import GNB from "@/components/layout/GNB";
import SandWatchIcon from "@/components/svg/SandWatchIcon";
import XWithCircleIcon from "@/components/svg/XWithCircleIcon";
import { GENRE_LIST } from "@/constants";
import { useUser } from "@/contexts/UserContext";
import customAxios from "@/lib/axios";
import { COLORS } from "@/styles/color";
import { TYPOGRAPHY } from "@/styles/typography";
import styled from "@emotion/styled";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import Image from "next/image";

const SentList = ({
  category,
  data,
}: {
  category: number | null;
  data: (SimpleArtistType | SimpleProjectType)[];
}) => {
  const router = useRouter();
  if (!data || data.length === 0) {
    return (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          color: COLORS.grayscale[600],
          ...TYPOGRAPHY.body1.medium,
        }}
      >
        보낸 연결이 없습니다.
      </div>
    );
  }

  const newProjectData = data as SimpleProjectType[];
  const newArtistData = data as SimpleArtistType[];

  // 아티스트
  if (category === 1) {
    return (
      <div
        style={{
          width: "100%",
          padding: "16px",
          display: "flex",
          flexDirection: "column",
          gap: "16px",
        }}
      >
        {newProjectData.map((item) => (
          <div
            key={item.id}
            style={{
              width: "100%",
              display: "flex",
              gap: "10px",
              cursor: "pointer",
            }}
            onClick={() => {
              router.push(`/connection/project/${item.id}/sent`);
            }}
          >
            <div
              style={{
                position: "relative",
                width: "86px",
                height: "86px",
                backgroundColor: COLORS.grayscale[500],
              }}
            >
              <Image
                src={item.image}
                alt={item.title}
                fill
                sizes="100%"
                style={{ objectFit: "cover" }}
                priority
              />
              <div style={{ position: "absolute", top: 4, left: 4 }}>
                {item.statusCode === 0 && <SandWatchIcon />}
                {item.statusCode === 1 && <XWithCircleIcon />}
              </div>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "6px",
                justifyContent: "space-between",
              }}
            >
              <div
                style={{
                  ...TYPOGRAPHY.body1["semiBold"],
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                <span
                  style={{
                    ...TYPOGRAPHY.caption["medium"],
                    color: COLORS.grayscale[100],
                    backgroundColor: COLORS.primary[500],
                    padding: "2px 6px",
                  }}
                >
                  {GENRE_LIST.find(
                    (genre) => genre.genreId === Number(item.genre)
                  )?.genreName || item.genre}
                </span>
                {item.title}
              </div>
              <div
                style={{
                  ...TYPOGRAPHY.body2["regular"],
                  color: COLORS.grayscale[1300],
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    gap: 3,
                    alignItems: "center",
                    ...TYPOGRAPHY.body2["regular"],
                  }}
                >
                  <div
                    style={{
                      minWidth: "40px",
                      width: "40px",
                      ...TYPOGRAPHY.caption["medium"],
                      color: COLORS.grayscale[700],
                    }}
                  >
                    소속사
                  </div>{" "}
                  {item.company}
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    gap: 3,
                    alignItems: "center",
                    ...TYPOGRAPHY.body2["regular"],
                  }}
                >
                  <div
                    style={{
                      minWidth: "40px",
                      width: "40px",
                      ...TYPOGRAPHY.caption["medium"],
                      color: COLORS.grayscale[700],
                    }}
                  >
                    상태
                  </div>{" "}
                  {item.status}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div
      style={{
        width: "100%",
        padding: "16px",
        display: "flex",
        flexDirection: "column",
        gap: "16px",
      }}
    >
      {newArtistData.map((item) => (
        <div
          key={item.id}
          style={{
            width: "100%",
            display: "flex",
            gap: "10px",
            cursor: "pointer",
          }}
          onClick={() => {
            router.push(`/connection/artist/${item.id}/sent`);
          }}
        >
          <div
            style={{
              position: "relative",
              width: "86px",
              height: "86px",
              backgroundColor: COLORS.grayscale[500],
            }}
          >
            <Image
              src={item.image}
              alt={item.title}
              fill
              sizes="100%"
              style={{ objectFit: "cover" }}
              priority
            />
            <div style={{ position: "absolute", top: 4, left: 4 }}>
              {item.statusCode === 0 && <SandWatchIcon />}
              {item.statusCode === 1 && <XWithCircleIcon />}
            </div>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "6px",
              justifyContent: "space-between",
            }}
          >
            <div
              style={{
                ...TYPOGRAPHY.body1["semiBold"],
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              {item.name}
            </div>
            <div
              style={{
                ...TYPOGRAPHY.body2["regular"],
                color: COLORS.grayscale[1300],
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  gap: 3,
                  alignItems: "center",
                  ...TYPOGRAPHY.body2["regular"],
                }}
              >
                <div
                  style={{
                    minWidth: "50px",
                    width: "50px",
                    ...TYPOGRAPHY.caption["medium"],
                    color: COLORS.grayscale[700],
                  }}
                >
                  프로젝트
                </div>{" "}
                {item.title}
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  gap: 3,
                  alignItems: "center",
                  ...TYPOGRAPHY.body2["regular"],
                }}
              >
                <div
                  style={{
                    minWidth: "50px",
                    width: "50px",
                    ...TYPOGRAPHY.caption["medium"],
                    color: COLORS.grayscale[700],
                  }}
                >
                  상태
                </div>{" "}
                {item.status}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

const ReceivedList = ({
  category,
  data,
}: {
  category: number | null;
  data: (SimpleProjectType | SimpleArtistType)[];
}) => {
  const router = useRouter();
  if (!data || data.length === 0) {
    return (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          color: COLORS.grayscale[600],
          ...TYPOGRAPHY.body1.medium,
        }}
      >
        받은 연결이 없습니다.
      </div>
    );
  }

  const newProjectData = data as SimpleProjectType[];
  const newArtistData = data as SimpleArtistType[];

  if (category === 1) {
    return (
      <div
        style={{
          width: "100%",
          padding: "16px",
          display: "flex",
          flexDirection: "column",
          gap: "16px",
        }}
      >
        {newProjectData.map((item) => (
          <div
            key={item.id}
            style={{
              width: "100%",
              display: "flex",
              gap: "10px",
              cursor: "pointer",
            }}
            onClick={() => {
              router.push(`/connection/project/${item.id}/received`);
            }}
          >
            <div
              style={{
                position: "relative",
                width: "86px",
                height: "86px",
                backgroundColor: COLORS.grayscale[500],
              }}
            >
              <Image
                src={item.image}
                alt={item.title}
                fill
                sizes="100%"
                style={{ objectFit: "cover" }}
                priority
              />
              <div style={{ position: "absolute", top: 4, left: 4 }}>
                {item.statusCode === 0 && <SandWatchIcon />}
                {item.statusCode === 1 && <XWithCircleIcon />}
              </div>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "6px",
                justifyContent: "space-between",
              }}
            >
              <div
                style={{
                  ...TYPOGRAPHY.body1["semiBold"],
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                <span
                  style={{
                    ...TYPOGRAPHY.caption["medium"],
                    color: COLORS.grayscale[100],
                    backgroundColor: COLORS.primary[500],
                    padding: "2px 6px",
                  }}
                >
                  {GENRE_LIST.find(
                    (genre) => genre.genreId === Number(item.genre)
                  )?.genreName || item.genre}
                </span>
                {item.title}
              </div>
              <div
                style={{
                  ...TYPOGRAPHY.body2["regular"],
                  color: COLORS.grayscale[1300],
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    gap: 3,
                    alignItems: "center",
                    ...TYPOGRAPHY.body2["regular"],
                  }}
                >
                  <div
                    style={{
                      minWidth: "40px",
                      width: "40px",
                      ...TYPOGRAPHY.caption["medium"],
                      color: COLORS.grayscale[700],
                    }}
                  >
                    소속사
                  </div>{" "}
                  {item.company}
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    gap: 3,
                    alignItems: "center",
                    ...TYPOGRAPHY.body2["regular"],
                  }}
                >
                  <div
                    style={{
                      minWidth: "40px",
                      width: "40px",
                      ...TYPOGRAPHY.caption["medium"],
                      color: COLORS.grayscale[700],
                    }}
                  >
                    상태
                  </div>{" "}
                  {item.status}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div
      style={{
        width: "100%",
        padding: "16px",
        display: "flex",
        flexDirection: "column",
        gap: "16px",
      }}
    >
      {newArtistData.map((item) => (
        <div
          key={item.id}
          style={{
            width: "100%",
            display: "flex",
            gap: "10px",
            cursor: "pointer",
          }}
          onClick={() => {
            router.push(`/connection/project/${item.id}/received`);
          }}
        >
          <div
            style={{
              position: "relative",
              width: "86px",
              height: "86px",
              backgroundColor: COLORS.grayscale[500],
            }}
          >
            <Image
              src={item.image}
              alt={item.title}
              fill
              sizes="100%"
              style={{ objectFit: "cover" }}
              priority
            />
            <div style={{ position: "absolute", top: 4, left: 4 }}>
              {item.statusCode === 0 && <SandWatchIcon />}
              {item.statusCode === 1 && <XWithCircleIcon />}
            </div>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "6px",
              justifyContent: "space-between",
            }}
          >
            <div
              style={{
                ...TYPOGRAPHY.body1["semiBold"],
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              {item.name}
            </div>
            <div
              style={{
                ...TYPOGRAPHY.body2["regular"],
                color: COLORS.grayscale[1300],
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  gap: 3,
                  alignItems: "center",
                  ...TYPOGRAPHY.body2["regular"],
                }}
              >
                <div
                  style={{
                    minWidth: "50px",
                    width: "50px",
                    ...TYPOGRAPHY.caption["medium"],
                    color: COLORS.grayscale[700],
                  }}
                >
                  프로젝트
                </div>{" "}
                {item.title}
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  gap: 3,
                  alignItems: "center",
                  ...TYPOGRAPHY.body2["regular"],
                }}
              >
                <div
                  style={{
                    minWidth: "50px",
                    width: "50px",
                    ...TYPOGRAPHY.caption["medium"],
                    color: COLORS.grayscale[700],
                  }}
                >
                  상태
                </div>{" "}
                {item.status}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

type SimpleArtistType = {
  id: number;
  name: string;
  title: string;
  status: string;
  statusCode: number;
  image: string;
};

type SimpleProjectType = {
  id: number;
  title: string;
  genre: string;
  status: string;
  statusCode: number;
  image: string;
  company: string;
};

const ConnectionPage = () => {
  const { user } = useUser();
  const [viewMode, setViewMode] = useState<"sent" | "received">("sent");
  const [sentList, setSentList] = useState<
    SimpleArtistType[] | SimpleProjectType[]
  >([]);
  const [receivedList, setReceivedList] = useState<
    SimpleArtistType[] | SimpleProjectType[]
  >([]);
  const handleModeChange = (mode: "sent" | "received") => {
    setViewMode(mode);
  };

  // /api/connect/getRecvProjectList -> 아티스트가 받은 연결
  // /api/connect/getSendProjectList -> 아티스트가 보낸 연결

  // /api/connect/getRecvArtistList -> 캐스터가 받은 연결
  // /api/connect/getSendArtistList -> 캐스터가 보낸 연결

  const fetchSentList = useCallback(async () => {
    console.log("Fetching sent list for user:", user);
    if (!user) return;
    if (user.category === 1) {
      // 아티스트
      const response = await customAxios.get("/api/connect/getSendProjectList");

      if (response.status !== 200) {
        console.error("Failed to fetch sent project list:", response);
        return [];
      }

      console.log("Sent project list response data:", response.data);
      return response.data;
    } else {
      // 캐스터
      const response = await customAxios.get("/api/connect/getSendArtistList");

      console.log("Sent artist list response data:", response.data);

      if (response.status !== 200) {
        console.error("Failed to fetch sent artist list:", response);
        return [];
      }

      return response.data;
    }
  }, [user]);

  const fetchReceivedList = useCallback(async () => {
    if (!user) return;
    if (user.category === 1) {
      // 아티스트
      const response = await customAxios.get("/api/connect/getRecvProjectList");

      if (response.status !== 200) {
        console.error("Failed to fetch received project list:", response);
        return [];
      }

      return response.data;
    } else {
      // 캐스터
      const response = await customAxios.get("/api/connect/getRecvArtistList");

      if (response.status !== 200) {
        console.error("Failed to fetch received artist list:", response);
        return [];
      }

      return response.data;
    }
  }, [user]);

  useEffect(() => {
    const getData = async () => {
      const sentData = await fetchSentList();
      setSentList(sentData);
      const receivedData = await fetchReceivedList();
      setReceivedList(receivedData);
    };
    getData();
  }, [fetchReceivedList, fetchSentList]);

  if (!user) {
    return <div>로그인이 필요합니다.</div>;
  }

  return (
    <Container>
      <ShadowHeader
        style={{
          ...TYPOGRAPHY.h2["bold"],
        }}
      >
        연결
      </ShadowHeader>
      <ArtistProjectButtonContainer>
        <ArtistProjectButton
          style={{
            ...TYPOGRAPHY.body1[viewMode === "sent" ? "semiBold" : "medium"],
          }}
          onClick={() => {
            handleModeChange("sent");
          }}
          selected={viewMode === "sent"}
        >
          보낸 연결
        </ArtistProjectButton>
        <ArtistProjectButton
          style={{
            ...TYPOGRAPHY.body1[
              viewMode === "received" ? "semiBold" : "medium"
            ],
          }}
          onClick={() => {
            handleModeChange("received");
          }}
          selected={viewMode === "received"}
        >
          받은 연결
        </ArtistProjectButton>
      </ArtistProjectButtonContainer>
      {viewMode === "sent" ? (
        <SentList category={user?.category} data={sentList} />
      ) : (
        <ReceivedList category={user?.category} data={receivedList} />
      )}
      <GNB />
    </Container>
  );
};

export default ConnectionPage;

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

const ArtistProjectButtonContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  gap: 6px;
  padding: 0 8px;
`;

const ArtistProjectButton = styled.button<{ selected?: boolean }>`
  width: 85px;
  height: 42px;
  padding: 8px 12px;
  border: none;
  color: ${({ selected }) =>
    selected ? COLORS.grayscale[1300] : COLORS.grayscale[600]};
  cursor: pointer;
`;

const ShadowHeader = styled.div`
  width: 100%;
  height: 57px;
  z-index: 10;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding: 0 16px;
  flex-shrink: 0;
`;
