import { jwtVerify } from "jose";

export interface SessionPayload {
  userId: string;
  email: string;
  exp?: number;
  iat?: number;
}

const secret = new TextEncoder().encode(
  process.env.JWT_SECRET || "therealslimshady",
);

export async function verifySessionToken(
  token: string,
): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secret, {
      clockTolerance: 5,
    });
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}
