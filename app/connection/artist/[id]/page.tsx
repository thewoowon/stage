"use client";

import { useUser } from "@/contexts/UserContext";
import { useRouter } from "next/navigation";
import { use } from "react";

const ArtistConnectionPage = ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = use(params);
  const router = useRouter();
  const { user } = useUser();

  return <div>Artist Connection Page</div>;
};

export default ArtistConnectionPage;
