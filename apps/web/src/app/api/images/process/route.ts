import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const REQUEST_TIMEOUT_MS = 30000; // 30s timeout para enfileirar

export async function POST(request: NextRequest) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }

  try {
    const formData = await request.formData();

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    try {
      const response = await fetch(`${API_URL}/images/process`, {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (response.status === 401) {
        return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
      }

      if (!response.ok) {
        return NextResponse.json(
          { error: "PROCESSING_FAILED" },
          { status: response.status },
        );
      }

      const data = await response.json();
      return NextResponse.json(data, { status: 202 });
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      return NextResponse.json({ error: "TIMEOUT" }, { status: 504 });
    }

    console.error("Erro ao enfileirar processamento de imagem:", error);
    return NextResponse.json({ error: "UNKNOWN" }, { status: 500 });
  }
}
