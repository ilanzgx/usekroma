import { FastifyRequest, FastifyReply } from "fastify";
import { GoogleAuthUseCase } from "@/usecases/auth/google-auth.usecase";
import { GoogleUserInfo } from "@/models/auth.model";
import { envConfig } from "@/config/env.config";

const FRONTEND_URL = envConfig.FRONTEND_URL;

export class AuthController {
  constructor(private readonly googleAuthUseCase: GoogleAuthUseCase) {}

  async googleCallback(req: FastifyRequest, reply: FastifyReply) {
    try {
      // get access token from Google OAuth2
      const { token } =
        await req.server.googleOAuth2.getAccessTokenFromAuthorizationCodeFlow(
          req,
        );

      // get user info from Google
      const response = await fetch(
        "https://www.googleapis.com/oauth2/v2/userinfo",
        {
          headers: {
            Authorization: `Bearer ${token.access_token}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error("Failed to fetch user info from Google");
      }

      const googleUser = (await response.json()) as GoogleUserInfo;

      // create or get existing user from database
      const user = await this.googleAuthUseCase.execute({
        email: googleUser.email,
        name: googleUser.name,
        googleId: googleUser.id,
        picture: googleUser.picture,
      });

      // generate JWT token
      const jwtToken = req.server.jwt.sign({
        userId: user.id,
        email: user.email,
      });

      // redirect to frontend API route with token (frontend will set HttpOnly cookie)
      return reply.redirect(
        `${FRONTEND_URL}/api/auth/callback?token=${jwtToken}`,
      );
    } catch (error) {
      req.log.error(error);
      // redirect to login with error
      const errorMessage =
        error instanceof Error ? error.message : "Authentication failed";
      return reply.redirect(
        `${FRONTEND_URL}/login?error=${encodeURIComponent(errorMessage)}`,
      );
    }
  }

  async logout(req: FastifyRequest, reply: FastifyReply) {
    reply.clearCookie("token", {
      path: "/",
    });
    return { success: true };
  }
}
