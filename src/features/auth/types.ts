export type LoginDto = {
  email: string;
  password: string;
};

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: string;
};

export type LoginResponseDto = {
  token: string;
  user: AuthUser;
};
