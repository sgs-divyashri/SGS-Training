export type SignInForm = {
  role: 'Admin' | 'User' | '';
  email: string;
  password: string;
};

export type RegisterForm = {
  name: string;
  role: string;
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