import { User } from "@/resources/user/user.types";

export interface LoginWithGoogleResponse {
  user: User;
  token: string;
}
