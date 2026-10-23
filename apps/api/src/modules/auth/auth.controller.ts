import { FastifyRequest, FastifyReply } from "fastify";
import { GoogleAuthUseCase } from "./google-auth.usecase";
import type { GoogleUserInfo } from "@kroma/shared";

export class AuthController {
  constructor(
    private readonly googleAuthUseCase: GoogleAuthUseCase,
    private readonly frontendUrl: string,
  ) {}

  async googleCallback(req: FastifyRequest, reply: FastifyReply) {
    try {
      const { token } = await req.server.googleOAuth2.getAccessTokenFromAuthorizationCodeFlow(req);

      const response = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
        headers: {
          Authorization: `Bearer ${token.access_token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch user info from Google");
      }

      const googleUser = (await response.json()) as GoogleUserInfo;

      const user = await this.googleAuthUseCase.execute({
        email: googleUser.email,
        name: googleUser.name,
        googleId: googleUser.id,
        picture: googleUser.picture,
      });

      const jwtToken = req.server.jwt.sign({
        userId: user.id,
        email: user.email,
      });

      return reply.redirect(`${this.frontendUrl}/api/auth/callback?token=${jwtToken}`);
    } catch (error) {
      req.log.error(error);
      const errorMessage = error instanceof Error ? error.message : "Authentication failed";
      return reply.redirect(`${this.frontendUrl}/login?error=${encodeURIComponent(errorMessage)}`);
    }
  }

  async logout(req: FastifyRequest, reply: FastifyReply) {
    reply.clearCookie("token", {
      path: "/",
    });
    return { success: true };
  }
}
