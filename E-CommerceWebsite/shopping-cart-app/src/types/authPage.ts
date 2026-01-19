export type SignInForm = {
  email: string;
  password: string;
};

export type RegisterForm = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export type ForgotForm = {
  email: string;
};

export type FormValues = {
  password: string;
  confirmPassword: string;
};