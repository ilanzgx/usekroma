import { jwtVerify } from "jose";

export interface SessionPayload {
  userId: string;
  email: string;
  exp?: number;
  iat?: number;
}

function getJwtSecret(): Uint8Array | null {
  const secretKey = process.env.JWT_SECRET;
  if (!secretKey) {
    return null;
  }
  return new TextEncoder().encode(secretKey);
}

export async function verifySessionToken(token: string): Promise<SessionPayload | null> {
  const secret = getJwtSecret();
  if (!secret) {
    return null;
  }
  try {
    const { payload } = await jwtVerify(token, secret, {
      clockTolerance: 5,
    });
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}
