"use client";

import { getProfile } from "@/resources/auth";
import { User } from "@/resources/user";
import { useEffect, useState } from "react";
import ToolsSection from "./_components/tools-section";
import ResizeSection from "./_components/resize-section";
import SocialMediaSection from "./_components/social-section";

export default function StudioPage() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    getProfile().then((response) => {
      setUser(response);
    });
  }, []);

  return (
    <div className="flex flex-col gap-4">
      <ResizeSection />
      <ToolsSection />
      <SocialMediaSection />
    </div>
  );
}
