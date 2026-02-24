import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const REQUEST_TIMEOUT_MS = 150000; // 2.5 minutos

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

      // Stream the binary response directly — no base64 conversion
      const blob = await response.blob();
      return new NextResponse(blob, {
        status: 200,
        headers: {
          "Content-Type": response.headers.get("Content-Type") || "image/png",
          "Content-Length": String(blob.size),
        },
      });
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      return NextResponse.json({ error: "TIMEOUT" }, { status: 504 });
    }

    console.error("Erro ao processar imagem:", error);
    return NextResponse.json({ error: "UNKNOWN" }, { status: 500 });
  }
}
