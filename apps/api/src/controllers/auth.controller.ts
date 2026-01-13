import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { OAuth2Namespace } from "@fastify/oauth2";
import { JWT } from "@fastify/jwt";
import { googleAuthUseCase } from "@/usecases/auth/google-auth.usecase";
import { GoogleUserInfo } from "@/models/auth.model";

const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";
const IS_PRODUCTION = process.env.NODE_ENV === "production";

export const authController = (fastify: FastifyInstance) => {
  fastify.get(
    "/google/callback",
    { config: { public: true } },
    async (req: FastifyRequest, reply: FastifyReply) => {
      try {
        // get access token from Google OAuth2
        const { token } =
          await fastify.googleOAuth2.getAccessTokenFromAuthorizationCodeFlow(
            req
          );

        // get user info from Google
        const response = await fetch(
          "https://www.googleapis.com/oauth2/v2/userinfo",
          {
            headers: {
              Authorization: `Bearer ${token.access_token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch user info from Google");
        }

        const googleUser = (await response.json()) as GoogleUserInfo;

        // create or get existing user from database
        const user = await googleAuthUseCase.execute({
          email: googleUser.email,
          name: googleUser.name,
          googleId: googleUser.id,
          picture: googleUser.picture,
        });

        // generate JWT token
        const jwtToken = fastify.jwt.sign({
          userId: user.id,
          email: user.email,
        });

        // set HttpOnly cookie
        reply.setCookie("token", jwtToken, {
          httpOnly: true,
          secure: IS_PRODUCTION,
          sameSite: "lax",
          path: "/",
          maxAge: 60 * 60 * 24 * 7, // 7 days
        });

        // redirect to studio
        return reply.redirect(`${FRONTEND_URL}/studio`);
      } catch (error) {
        req.log.error(error);
        // redirect to login with error
        const errorMessage =
          error instanceof Error ? error.message : "Authentication failed";
        return reply.redirect(
          `${FRONTEND_URL}/login?error=${encodeURIComponent(errorMessage)}`
        );
      }
    }
  );

  fastify.post(
    "/logout",
    { config: { public: true } },
    async (req: FastifyRequest, reply: FastifyReply) => {
      reply.clearCookie("token", {
        path: "/",
      });
      return { success: true };
    }
  );
};
