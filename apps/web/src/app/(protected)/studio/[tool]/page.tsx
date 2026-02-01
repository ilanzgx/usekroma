import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getToolBySlug, getAllSlugs } from "@/lib/tools";
import EditorSection from "../_components/editor-section";

interface ToolPageProps {
  params: Promise<{ tool: string }>;
}

export async function generateStaticParams() {
  return getAllSlugs();
}

export async function generateMetadata({
  params,
}: ToolPageProps): Promise<Metadata> {
  const { tool: toolId } = await params;
  const tool = getToolBySlug(toolId);

  if (!tool) {
    return {
      title: "Tool Not Found",
    };
  }

  return {
    title: tool.seo.title,
    description: tool.seo.description,
    keywords: tool.seo.keywords,
    openGraph: {
      title: tool.seo.title,
      description: tool.seo.description,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: tool.seo.title,
      description: tool.seo.description,
    },
  };
}

export default async function ToolPage({ params }: ToolPageProps) {
  const { tool: toolId } = await params;
  const tool = getToolBySlug(toolId);

  if (!tool) {
    notFound();
  }

  return (
    <div>
      <EditorSection toolId={toolId} />
    </div>
  );
}
