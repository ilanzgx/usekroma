import ToolsSection from "./_components/tools-section";
import ResizeSection from "./_components/resize-section";
import SocialMediaSection from "./_components/social-section";
import WelcomeBanner from "./_components/welcome-banner";

export default function StudioPage() {
  return (
    <div className="flex flex-col gap-4">
      <WelcomeBanner />
      <SocialMediaSection />
      <ResizeSection />
      <ToolsSection />
    </div>
  );
}
