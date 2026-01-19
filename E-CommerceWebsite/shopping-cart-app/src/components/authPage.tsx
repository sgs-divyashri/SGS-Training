import React, { useState } from "react";
import { useForm } from "react-hook-form";
import Joi from "joi";
import { joiResolver } from "@hookform/resolvers/joi";
import { SignInForm, RegisterForm, ForgotForm } from "../types/authPage";
import { api } from "../axios/axiosClient";
import { useNavigate } from "react-router-dom";

type Mode = "signin" | "register" | "forgot";

/** Validation Schemas*/
const signInSchema = Joi.object({
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

const registerSchema = Joi.object({
  name: Joi.string().min(2).required().messages({
    "string.min": "Name is too short",
    "string.empty": "Name is required",
    "any.required": "Name is required",
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

const forgotSchema = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      "string.email": "Invalid email",
      "string.empty": "Email is required",
      "any.required": "Email is required",
    }),
});

interface LoginResponse {
  token: string;
}
interface RegisterResponse {
  userId: number;
}
interface ForgotResponse {
  message: string;
}

export default function AuthPage() {
  const [mode, setMode] = useState<Mode>("signin");
  const [serverMessage, setServerMessage] = useState<string | null>(null);
  const isSignIn = mode === "signin";
  const isRegister = mode === "register";
  const isForgot = mode === "forgot";
  const navigate = useNavigate();

  // Main SignIn/Register form
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<SignInForm | RegisterForm>({
    resolver: joiResolver(isSignIn ? signInSchema : registerSchema),
    defaultValues: isSignIn
      ? { email: "", password: "" }
      : { name: "", email: "", password: "", confirmPassword: "" },
    mode: "onBlur",
  });

  // Separate form for Forgot Password (email-only)
  const {
    register: registerForgot,
    handleSubmit: handleSubmitForgot,
    formState: { errors: forgotErrors, isSubmitting: isSubmittingForgot },
    reset: resetForgot,
  } = useForm<ForgotForm>({
    resolver: joiResolver(forgotSchema),
    defaultValues: { email: "" },
    mode: "onBlur",
  });

  function switchMode(next: Mode) {
    setMode(next);
    setServerMessage(null);
    if (next === "signin") {
      reset({ email: "", password: "" });
    } else if (next === "register") {
      reset({ name: "", email: "", password: "", confirmPassword: "" });
    } else {
      resetForgot({ email: "" });
    }
  }

  async function onSubmit(values: SignInForm | RegisterForm) {
    setServerMessage(null);
    try {
      if (isSignIn) {
        /** ---- Sign In ---- */
        const body = values as SignInForm;
        const res = await api.post<LoginResponse>("/users/login", body);
        const data = res.data;

        localStorage.setItem("token", data.token);
        navigate("/home");
      } else {
        /** ---- Register ---- */
        const body = values as RegisterForm;
        const res = await api.post<RegisterResponse>("/users/register", body);
        const createdUser = res.data;
        alert(`Registered ${createdUser.userId}`);

        setMode("signin");
        reset({ email: body.email, password: "" });
        setServerMessage("Account created successfully. Please sign in.");
      }
    } catch (err: any) {
      const message =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        err?.message ||
        "Something went wrong.";
      setServerMessage(message);
    }
  }

  async function onSubmitForgot(values: ForgotForm) {
    setServerMessage(null);
    try {
      const res = await api.post<ForgotResponse>(
        "/users/forgot-password",
        values
      );
      const data = res.data;
      setServerMessage(
        data?.message || "If this email exists, a reset link has been sent."
      );
    } catch (err: any) {
      const message =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        err?.message ||
        "Something went wrong.";
      setServerMessage(message);
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <section className="w-full max-w-md bg-white rounded-2xl shadow-lg">
        {/* Header / Tabs */}
        <div className="px-6 pt-6">
          <h1 className="text-2xl font-semibold text-gray-900">
            {isSignIn
              ? "Sign In"
              : isRegister
              ? "Create Account"
              : "Reset Password"}
          </h1>

          {/* Only show tabs when not in forgot mode */}
          {!isForgot && (
            <div className="mt-4 flex rounded-lg bg-gray-100 p-1">
              <button
                type="button"
                onClick={() => switchMode("signin")}
                className={`flex-1 p-2 rounded-md text-sm font-medium transition ${
                  isSignIn
                    ? "bg-white text-blue-600 shadow"
                    : "text-gray-600 hover:text-gray-800"
                }`}
                aria-pressed={isSignIn}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => switchMode("register")}
                className={`flex-1 py-2 rounded-md text-sm font-medium transition ${
                  isRegister
                    ? "bg-white text-blue-600 shadow"
                    : "text-gray-600 hover:text-gray-800"
                }`}
                aria-pressed={isRegister}
              >
                Register
              </button>
            </div>
          )}
        </div>

        {/* Server banner */}
        {serverMessage && (
          <div className="px-6 pt-3">
            <p className="text-sm text-blue-700 bg-blue-50 border border-blue-200 rounded px-3 py-2">
              {serverMessage}
            </p>
          </div>
        )}

        {/* Forms */}
        {!isForgot ? (
          // Sign In / Register Form
          <form
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            className="px-6 pb-6 pt-4 space-y-4"
          >
            {!isSignIn && (
              <Field
                id="name"
                label="Name"
                error={(errors as any)?.name?.message}
              >
                <input
                  id="name"
                  type="text"
                  autoComplete="name"
                  {...register("name" as any)}
                  className={inputClass}
                  placeholder="Enter Full Name"
                />
              </Field>
            )}

            <Field
              id="email"
              label="Email"
              error={(errors as any)?.email?.message}
            >
              <input
                id="email"
                type="email"
                autoComplete="email"
                {...register("email")}
                className={inputClass}
                placeholder="Enter email ID"
              />
            </Field>

            <Field
              id="password"
              label="Password"
              error={(errors as any)?.password?.message}
            >
              <input
                id="password"
                type="password"
                autoComplete={isSignIn ? "current-password" : "new-password"}
                {...register("password")}
                className={inputClass}
                placeholder="Enter Password"
              />
            </Field>

            {!isSignIn && (
              <Field
                id="confirmPassword"
                label="Confirm Password"
                error={(errors as any)?.confirmPassword?.message}
              >
                <input
                  id="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  {...register("confirmPassword" as any)}
                  className={inputClass}
                  placeholder="Re-enter Password"
                />
              </Field>
            )}

            {/* Forgot password trigger (Sign In only) */}
            {isSignIn && (
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => switchMode("forgot")}
                  className="text-sm text-blue-600 hover:text-blue-700 underline underline-offset-2"
                  aria-label="Forgot your password? Open reset form"
                >
                  Forgot password?
                </button>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full inline-flex justify-center items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-white font-semibold shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting
                ? isSignIn
                  ? "Signing in..."
                  : "Creating account..."
                : isSignIn
                ? "Sign In"
                : "Register"}
            </button>

            <p className="text-sm text-gray-600">
              {isSignIn ? (
                <>
                  Don’t have an account?{" "}
                  <button
                    type="button"
                    onClick={() => switchMode("register")}
                    className="text-blue-600 underline underline-offset-2 hover:text-blue-700"
                  >
                    Register
                  </button>
                </>
              ) : (
                <>
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={() => switchMode("signin")}
                    className="text-blue-600 underline underline-offset-2 hover:text-blue-700"
                  >
                    Sign In
                  </button>
                </>
              )}
            </p>
          </form>
        ) : (
          // Forgot Password Card (email-only)
          <form
            onSubmit={handleSubmitForgot(onSubmitForgot)}
            noValidate
            className="px-6 pb-6 pt-4 space-y-4"
          >
            <p className="text-sm text-gray-700">
              Enter your email address and we’ll send you a link to reset your
              password.
            </p>

            <Field
              id="forgot-email"
              label="Email"
              error={forgotErrors?.email?.message}
            >
              <input
                id="forgot-email"
                type="email"
                autoComplete="email"
                {...registerForgot("email")}
                className={inputClass}
                placeholder="Enter your email"
              />
            </Field>

            <div className="flex items-center gap-3">
              <button
                type="submit"
                disabled={isSubmittingForgot}
                className="inline-flex justify-center items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-white font-semibold shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isSubmittingForgot ? "Sending..." : "Send reset link"}
              </button>

              <button
                type="button"
                onClick={() => switchMode("signin")}
                className="text-sm text-gray-600 hover:text-gray-800 underline underline-offset-2"
              >
                Back to Sign In
              </button>
            </div>
          </form>
        )}
      </section>
    </main>
  );
}

/* Reusable Field component */
function Field({
  id,
  label,
  error,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      {children}
      {error && (
        <p className="text-sm text-red-600 bg-red-50 px-2 py-1 rounded">
          {error}
        </p>
      )}
    </div>
  );
}

const inputClass =
  "w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 shadow-sm outline-none";
