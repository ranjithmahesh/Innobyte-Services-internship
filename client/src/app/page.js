"use client";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

function Home() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/auth/login");
  }, []);
  return <div>Loading ...
  </div>;
}

export default Home;
