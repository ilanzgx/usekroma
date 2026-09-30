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
    const response = await fetch(`${API_URL}/jobs/${id}`, {
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
      return NextResponse.json(
        { error: "JOB_NOT_FOUND" },
        { status: response.status },
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error(`Erro ao consultar job ${id}:`, error);
    return NextResponse.json({ error: "UNKNOWN" }, { status: 500 });
  }
}
