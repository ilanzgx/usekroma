import OAuth2, { FastifyOAuth2Options } from "@fastify/oauth2";
import { envConfig } from "@/config/env.config";

const IS_PRODUCTION = envConfig.NODE_ENV === "production";

export const googleOAuthConfig: FastifyOAuth2Options = {
  name: "googleOAuth2",
  scope: ["profile", "email"],
  credentials: {
    client: {
      id: envConfig.GOOGLE_CLIENT_ID,
      secret: envConfig.GOOGLE_CLIENT_SECRET,
    },
    auth: OAuth2.GOOGLE_CONFIGURATION,
  },
  startRedirectPath: "/v1/auth/google",
  callbackUri:
    envConfig.GOOGLE_CALLBACK_URL ||
    "http://localhost:8080/v1/auth/google/callback",
  cookie: {
    secure: IS_PRODUCTION,
    sameSite: IS_PRODUCTION ? "none" : "lax",
  },
};
