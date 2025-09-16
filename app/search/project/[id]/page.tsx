"use client";
import GNB from "@/components/layout/GNB";
import Header from "@/components/layout/Header";
import styled from "@emotion/styled";
import { use } from "react";

const ProjectPage = ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = use(params);

  console.log("Artist ID:", id);

  return (
    <Container>
      <Header />
      <GNB />
    </Container>
  );
};

export default ProjectPage;

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
