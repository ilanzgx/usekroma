"use client";

import { getProfile } from "@/resources/auth";
import { User } from "@/resources/user";
import { useEffect, useState } from "react";
import ToolsSection from "./_components/tools-section";
import { Metadata } from "next";

export default function StudioPage() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    getProfile().then((response) => {
      setUser(response);
    });
  }, []);

  return <ToolsSection />;
}
