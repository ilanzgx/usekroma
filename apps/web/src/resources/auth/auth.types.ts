export interface User {
  id: string;
  email: string;
  name: string;
  googleId: string;
  picture?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LoginWithGoogleResponse {
  user: User;
  token: string;
}
