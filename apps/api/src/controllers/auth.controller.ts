import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { OAuth2Namespace } from "@fastify/oauth2";
import { JWT } from "@fastify/jwt";
import { googleAuthUseCase } from "@/usecases/auth/google-auth.usecase";
import { GoogleUserInfo } from "@/models/auth.model";

export const authController = (fastify: FastifyInstance) => {
  fastify.get(
    "/google/callback",
    { config: { public: true } },
    async (req: FastifyRequest, reply: FastifyReply) => {
      try {
        // Get access token from Google OAuth2
        const { token } =
          await fastify.googleOAuth2.getAccessTokenFromAuthorizationCodeFlow(
            req
          );

        // Get user info from Google
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

        // Create or get existing user from database
        const user = await googleAuthUseCase.execute({
          email: googleUser.email,
          name: googleUser.name,
          googleId: googleUser.id,
          picture: googleUser.picture,
        });

        // Generate JWT token
        const jwtToken = fastify.jwt.sign({
          userId: user.id,
          email: user.email,
        });

        // return reply.redirect(`http://localhost:3000/auth/callback?token=${jwt}`);
        // Temporary response
        return {
          token: jwtToken,
          user: {
            googleId: googleUser.id,
            email: googleUser.email,
            name: googleUser.name,
            picture: googleUser.picture,
          },
        };
      } catch (error) {
        req.log.error(error);
        reply.status(401);
        return {
          error: "Authentication failed",
          message: error instanceof Error ? error.message : "Unknown error",
        };
      }
    }
  );
};
