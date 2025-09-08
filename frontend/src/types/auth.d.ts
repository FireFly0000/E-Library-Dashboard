export type Login = {
  email: string;
  password: string;
};

export type LoginResponse = {
  accessToken: string;
  refreshToken: string;
  sessionId: string;
};

export type Token = {
  accessToken: string;
  refreshToken: string;
};

export type ForgotPassword = {
  email: string;
};

export type ResetPassword = {
  confirmPassword: string;
  password: string;
  token: string;
};

export type Register = {
  username: string;
  email: string;
  password: string;
  confirm_password: string;
};

export type SessionInfo = {
  sessionId: string;
  userAgent: string;
};
