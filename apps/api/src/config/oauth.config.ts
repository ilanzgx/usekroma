import OAuth2, { FastifyOAuth2Options } from "@fastify/oauth2";

export const googleOAuthConfig: FastifyOAuth2Options = {
  name: "googleOAuth2",
  scope: ["profile", "email"],
  credentials: {
    client: {
      id: process.env.GOOGLE_CLIENT_ID || "",
      secret: process.env.GOOGLE_CLIENT_SECRET || "",
    },
    auth: OAuth2.GOOGLE_CONFIGURATION,
  },
  startRedirectPath: "/v1/auth/google",
  callbackUri:
    process.env.GOOGLE_CALLBACK_URL ||
    "http://localhost:8080/v1/auth/google/callback",
};
