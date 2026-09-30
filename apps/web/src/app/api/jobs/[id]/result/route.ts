import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const rawApiUrl = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || "http://api:8080/v1";
const API_URL = rawApiUrl.endsWith("/v1") ? rawApiUrl : `${rawApiUrl.replace(/\/+$/, "")}/v1`;

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const response = await fetch(`${API_URL}/jobs/${id}/result`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 401) {
      return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
    }

    if (!response.ok) {
      return NextResponse.json(
        { error: "RESULT_NOT_AVAILABLE" },
        { status: response.status },
      );
    }

    const blob = await response.blob();
    return new NextResponse(blob, {
      status: 200,
      headers: {
        "Content-Type": response.headers.get("Content-Type") || "image/png",
        "Content-Length": String(blob.size),
      },
    });
  } catch (error) {
    console.error(`Erro ao baixar resultado do job ${id}:`, error);
    return NextResponse.json({ error: "UNKNOWN" }, { status: 500 });
  }
}
