
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "../axios/axiosClient"; // make sure this is configured
import { useNavigate } from "react-router-dom";

type Mode = "signin" | "register";

/** ---- Validation Schemas ---- */
const signInSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(8, "Minimum 8 characters"),
});

const registerSchema = z
  .object({
    name: z.string().min(2, "Name is too short"),
    email: z.string().email("Invalid email"),
    password: z.string().min(8, "Minimum 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

type SignInForm = z.infer<typeof signInSchema>;
type RegisterForm = z.infer<typeof registerSchema>;

/** ---- Backend response types (adjust to your API) ---- */
interface LoginResponse {
  token: string;
  user: {
    userId: number;
    name: string;
    email: string;
  };
}

interface RegisterResponse {
  userId: number;
  name: string;
  email: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function AuthPage() {
  const [mode, setMode] = useState<Mode>("signin");
  const [serverError, setServerError] = useState<string | null>(null);
  const isSignIn = mode === "signin";
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<SignInForm | RegisterForm>({
    resolver: zodResolver(isSignIn ? signInSchema : registerSchema),
    defaultValues: isSignIn
      ? { email: "", password: "" }
      : { name: "", email: "", password: "", confirmPassword: ""},
    mode: "onBlur",
  });

  function switchMode(next: Mode) {
    setMode(next);
    setServerError(null);
    reset(
      next === "signin"
        ? { email: "", password: "" }
        : { name: "", email: "", password: "", confirmPassword: ""}
    );
  }

  async function onSubmit(values: SignInForm | RegisterForm) {
    setServerError(null);
    try {
      if (isSignIn) {
        /** ---- Sign In ---- */
        const body = values as SignInForm;
        const res = await api.post<LoginResponse>("/users/login", body);
        const data = res.data;

        // store token (choose cookie or localStorage)
        localStorage.setItem("token", data.token);
        // redirect to your app page (NavBar will show via AppLayout)
        navigate("/home");
      } else {
        /** ---- Register ---- */
        const body = values as RegisterForm;
        const payload = {
          name: body.name.trim(),
          email: body.email.trim(),
          password: body.password,
        };

        const res = await api.post<RegisterResponse>("/users/register", payload);
        const createdUser = res.data;
        console.log("Registered:", createdUser);

        // Switch to Sign In and prefill email for convenience
        setMode("signin");
        reset({ email: payload.email, password: "" });
        setServerError("Account created successfully. Please sign in.");
      }
    } catch (err: any) {
      // Extract a meaningful error message (depends on your backend response)
      const message =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        err?.message ||
        "Something went wrong.";
      setServerError(message);
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <section
        className="w-full max-w-md bg-white rounded-2xl shadow-lg ring-1 ring-black/5 overflow-hidden"
        aria-live="polite"
      >
        {/* Header / Tabs */}
        <div className="px-6 pt-6">
          <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
            {isSignIn ? "Sign In" : "Create Account"}
          </h1>

          <div className="mt-4 flex rounded-lg bg-gray-100 p-1">
            <button
              type="button"
              onClick={() => switchMode("signin")}
              className={`flex-1 py-2 rounded-md text-sm font-medium transition ${
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
                !isSignIn
                  ? "bg-white text-blue-600 shadow"
                  : "text-gray-600 hover:text-gray-800"
              }`}
              aria-pressed={!isSignIn}
            >
              Register
            </button>
          </div>
        </div>

        {/* Server banner */}
        {serverError && (
          <div className="px-6 pt-3">
            <p className="text-sm text-blue-700 bg-blue-50 border border-blue-200 rounded px-3 py-2">
              {serverError}
            </p>
          </div>
        )}

        {/* Form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="px-6 pb-6 pt-4 space-y-4"
        >
          {!isSignIn && (
            <Field id="name" label="Name" error={(errors as any)?.name?.message}>
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

          <Field id="email" label="Email" error={(errors as any)?.email?.message}>
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
            <>
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
            </>
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

          {/* Helper link */}
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
      </section>
    </main>
  );
}

/* ---------- Reusable Field component ---------- */
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

/* ---------- Tailwind input classes ---------- */
const inputClass =
  "w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 shadow-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200";
