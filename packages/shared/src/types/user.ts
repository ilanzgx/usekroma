export interface UserDTO {
  id: string;
  name: string;
  email: string;
  credits: number;
  googleId: string;
  picture?: string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export type User = UserDTO;

export interface GoogleUserInfo {
  id: string;
  email: string;
  verified_email: boolean;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
}
