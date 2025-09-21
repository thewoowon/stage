"use client";
import GNB from "@/components/layout/GNB";
import SandWatchIcon from "@/components/svg/SandWatchIcon";
import XWithCircleIcon from "@/components/svg/XWithCircleIcon";
import { useUser } from "@/contexts/UserContext";
import customAxios from "@/lib/axios";
import { COLORS } from "@/styles/color";
import { TYPOGRAPHY } from "@/styles/typography";
import styled from "@emotion/styled";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

const SENT_PROJECT_DATA = [
  {
    id: 1,
    title: "나의 아저씨",
    genre: "드라마",
    status: "촬영중",
    statusCode: 1,
    image:
      "https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyMDAzMDNfMTYy%2FMDAxNTgzNjI0NzI0NzE3.XxX4rYkYkzHk9n1c1j8nJQmX1a5r9g5cZV8vZtV6gYgg.4nUu7c3bGZ1k8J6vU6qfXoFqfXoFqfXoFqfXoFqfXoFqg.JPEG.choi1225%2FIMG_20200303_124947.jpg&type=sc960_832",
    company: "tvN",
  },
];

const RECEIEVED_PROJECT_DATA = [
  {
    id: 1,
    title: "나의 아저씨",
    genre: "드라마",
    status: "촬영중",
    statusCode: 1,
    image:
      "https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyMDAzMDNfMTYy%2FMDAxNTgzNjI0NzI0NzE3.XxX4rYkYkzHk9n1c1j8nJQmX1a5r9g5cZV8vZtV6gYgg.4nUu7c3bGZ1k8J6vU6qfXoFqfXoFqfXoFqfXoFqfXoFqg.JPEG.choi1225%2FIMG_20200303_124947.jpg&type=sc960_832",
    company: "tvN",
  },
];

const SENT_ARTIST_DATA = [
  {
    id: 1,
    name: "아이유",
    title: "배우",
    status: "섭외중",
    statusCode: 1,
    image:
      "https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyMDAzMDNfMTYy%2FMDAxNTgzNjI0NzI0NzE3.XxX4rYkYkzHk9n1c1j8nJQmX1a5r9g5cZV8vZtV6gYgg.4nUu7c3bGZ1k8J6vU6qfXoFqfXoFqfXoFqfXoFqfXoFqg.JPEG.choi1225%2FIMG_20200303_124947.jpg&type=sc960_832",
  },
];

const RECEIEVED_ARTIST_DATA = [
  {
    id: 1,
    name: "아이유",
    title: "배우",
    status: "섭외중",
    statusCode: 1,
    image:
      "https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyMDAzMDNfMTYy%2FMDAxNTgzNjI0NzI0NzE3.XxX4rYkYkzHk9n1c1j8nJQmX1a5r9g5cZV8vZtV6gYgg.4nUu7c3bGZ1k8J6vU6qfXoFqfXoFqfXoFqfXoFqfXoFqg.JPEG.choi1225%2FIMG_20200303_124947.jpg&type=sc960_832",
  },
];

const SentList = ({
  category,
  data,
}: {
  category: number | null;
  data: (SimpleArtistType | SimpleProjectType)[];
}) => {
  const router = useRouter();
  if (data.length === 0) {
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
              <div style={{ position: "absolute", top: 4, left: 4 }}>
                <XWithCircleIcon />
                {false && <SandWatchIcon />}
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
                  {item.genre}
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
                      minWidth: "30px",
                      width: "30px",
                      ...TYPOGRAPHY.caption["medium"],
                      color: COLORS.grayscale[700],
                    }}
                  >
                    배역
                  </div>{" "}
                  {item.status}
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
                      minWidth: "30px",
                      width: "30px",
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
            router.push(`/connection/project/${item.id}/sent`);
          }}
        >
          <div
            style={{
              width: "86px",
              height: "86px",
              backgroundColor: COLORS.grayscale[1300],
            }}
          ></div>
          <div>
            <div>{item.title}</div>
            <div>프로젝트 {item.title}</div>
            <div>상태 {item.status}</div>
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
  if (data.length === 0) {
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
            style={{ width: "100%", display: "flex", gap: "10px" }}
          >
            <div
              style={{
                position: "relative",
                width: "86px",
                height: "86px",
                backgroundColor: COLORS.grayscale[500],
              }}
            >
              {" "}
              <div style={{ position: "absolute", top: 4, left: 4 }}>
                <XWithCircleIcon />
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
                  {item.genre}
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
                      minWidth: "30px",
                      width: "30px",
                      ...TYPOGRAPHY.caption["medium"],
                      color: COLORS.grayscale[700],
                    }}
                  >
                    배역
                  </div>{" "}
                  {item.status}
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
                      minWidth: "30px",
                      width: "30px",
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
    <div>
      {newArtistData.map((item) => (
        <div key={item.id}>
          <div
            style={{
              width: "86px",
              height: "86px",
              backgroundColor: COLORS.grayscale[1300],
            }}
          ></div>
          <div>
            <div>{item.name}</div>
            <div>프로젝트 {item.title}</div>
            <div>상태 {item.status}</div>
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
  console.log("user", user);
  const [viewMode, setViewMode] = useState<"sent" | "received">("sent");
  const [sentList, setSentList] = useState<
    SimpleArtistType[] | SimpleProjectType[]
  >(SENT_ARTIST_DATA);
  const [receivedList, setReceivedList] = useState<
    SimpleArtistType[] | SimpleProjectType[]
  >(RECEIEVED_ARTIST_DATA);
  const handleModeChange = (mode: "sent" | "received") => {
    setViewMode(mode);
  };

  // /api/connect/getRecvProjectList -> 아티스트가 받은 연결
  // /api/connect/getSendProjectList -> 아티스트가 보낸 연결

  // /api/connect/getRecvArtistList -> 캐스터가 받은 연결
  // /api/connect/getSendArtistList -> 캐스터가 보낸 연결

  const fetchSentList = useCallback(async () => {
    if (user.category === 1) {
      // 아티스트
      const response = await customAxios.get("/api/connect/getSendProjectList");
      return response.data;
    } else {
      // 캐스터
      const response = await customAxios.get("/api/connect/getSendArtistList");
      return response.data;
    }
  }, [user.category]);

  const fetchReceivedList = useCallback(async () => {
    if (user.category === 1) {
      // 아티스트
      const response = await customAxios.get("/api/connect/getRecvProjectList");
      return response.data;
    } else {
      // 캐스터
      const response = await customAxios.get("/api/connect/getRecvArtistList");
      return response.data;
    }
  }, [user.category]);

  useEffect(() => {
    const getData = async () => {
      const sentData = await fetchSentList();
      console.log("sentData", sentData);
      // setSentList(sentData);
      const receivedData = await fetchReceivedList();
      console.log("receivedData", receivedData);
      // setReceivedList(receivedData);
    };
    getData();
  }, [fetchReceivedList, fetchSentList]);

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
        <SentList category={1} data={sentList} />
      ) : (
        <ReceivedList category={1} data={receivedList} />
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
