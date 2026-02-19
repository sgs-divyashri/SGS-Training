import Joi from "joi";

export type Mode = "signin" | "register";

export const signInSchema = Joi.object({
  role: Joi.string().valid("Admin", "User").required().messages({
    "any.only": "Select a Valid role",
    "string.empty": "Role is Required",
    "any.required": "Role is Required",
  }),
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      "string.email": "Invalid email",
      "string.empty": "Email is required",
      "any.required": "Email is required",
    }),
  password: Joi.string().min(8).required().messages({
    "string.min": "Minimum 8 characters",
    "string.empty": "Password is required",
    "any.required": "Password is required",
  }),
});

export const registerSchema = Joi.object({
  name: Joi.string().min(2).required().messages({
    "string.min": "Name is too short",
    "string.empty": "Name is required",
    "any.required": "Name is required",
  }),
  role: Joi.string().valid("Admin", "User").required().messages({
    "any.only": "Select a Valid role",
    "string.empty": "Role is Required",
    "any.required": "Role is Required",
  }),
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      "string.email": "Invalid email",
      "string.empty": "Email is required",
      "any.required": "Email is required",
    }),
  password: Joi.string().min(8).required().messages({
    "string.min": "Minimum 8 characters",
    "string.empty": "Password is required",
    "any.required": "Password is required",
  }),
  confirmPassword: Joi.string().valid(Joi.ref("password")).required().messages({
    "any.only": "Passwords do not match",
    "string.empty": "Please confirm your password",
    "any.required": "Please confirm your password",
  }),
});

export interface LoginResponse {
  token: string;
}
export interface RegisterResponse {
  userId: number;
}

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
