import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const rawApiUrl = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || "http://api:8080/v1";
const API_URL = rawApiUrl.endsWith("/v1") ? rawApiUrl : `${rawApiUrl.replace(/\/+$/, "")}/v1`;

export async function GET(request: NextRequest) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const queryString = searchParams.toString();
  const targetUrl = queryString ? `${API_URL}/jobs?${queryString}` : `${API_URL}/jobs`;

  try {
    const response = await fetch(targetUrl, {
      cache: "no-store",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 401) {
      const res = NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
      res.cookies.delete("token");
      return res;
    }

    if (!response.ok) {
      return NextResponse.json({ error: "FAILED_TO_FETCH_JOBS" }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "private, no-cache, no-store, max-age=0, must-revalidate",
        Pragma: "no-cache",
      },
    });
  } catch (error) {
    console.error("Erro ao listar jobs:", error);
    return NextResponse.json({ error: "UNKNOWN" }, { status: 500 });
  }
}
