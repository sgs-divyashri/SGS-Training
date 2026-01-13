// src/pages/ResetPassword.tsx
import React, { useMemo, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "../axios/axiosClient";

const schema = z
  .object({
    password: z
      .string()
      .min(8, "Minimum 8 characters")
      .regex(/[A-Z]/, "Must contain at least one uppercase letter")
      .regex(/[a-z]/, "Must contain at least one lowercase letter")
      .regex(/[0-9]/, "Must contain at least one digit"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

type FormValues = z.infer<typeof schema>;

export default function ResetPassword() {
  const [params] = useSearchParams();
  const token = params.get("token");
  const navigate = useNavigate();
  const [serverMsg, setServerMsg] = useState<string | null>(null);
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: "onBlur",
    defaultValues: { password: "", confirmPassword: "" },
  });

  const isTokenMissing = useMemo(() => !token, [token]);

  async function onSubmit(values: FormValues) {
    setServerMsg(null);
    try {
      const res = await api.post(
        "/users/reset-password",
        { password: values.password }, // <-- body
        { headers: { Authorization: `Bearer ${token}` } } // <-- config (headers)
      );
      setServerMsg(res?.data?.message || "Password updated successfully.");
      // Optionally redirect to sign-in after a short delay:
      setTimeout(() => navigate("/"), 2000);
    } catch (err: any) {
      const msg =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        err?.message ||
        "Something went wrong.";
      setServerMsg(msg);
    }
  }

  if (isTokenMissing) {
    return (
      <main className="min-h-screen bg-blue-50 flex items-center justify-center p-4">
        <section className="w-full max-w-lg bg-white rounded-xl shadow p-8">
          <h1 className="text-2xl font-semibold text-gray-900 mb-4">
            Reset Password
          </h1>
          <p className="text-gray-700">
            Reset link is invalid or missing. Please request a new link.
          </p>
          <button
            className="mt-6 text-blue-600 hover:text-blue-700 underline underline-offset-2"
            onClick={() => navigate("/")}
            type="button"
          >
            ← Back to Sign In
          </button>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-blue-50 flex items-center justify-center p-4">
      <section className="w-full max-w-lg bg-white rounded-xl shadow p-8">
        {/* Logo / Brand */}
        <div className="flex justify-center mb-4">
          {/* Replace with your logo if needed */}
          <span className="text-xl font-bold text-pink-700">Amazon</span>
        </div>

        <h1 className="text-2xl font-semibold text-gray-900 text-center">
          Reset Password
        </h1>

        {serverMsg && (
          <p className="mt-3 text-sm text-blue-700 bg-blue-50 border border-blue-200 rounded px-3 py-2">
            {serverMsg}
          </p>
        )}

        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="mt-6 space-y-5"
        >
          {/* Create Password */}
          <div className="space-y-1.5">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Create Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPwd ? "text" : "password"}
                autoComplete="new-password"
                {...register("password")}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 shadow-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 pr-10"
                placeholder="Enter a strong password"
                aria-invalid={!!errors.password}
              />
              <button
                type="button"
                onClick={() => setShowPwd((s) => !s)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                aria-label={showPwd ? "Hide password" : "Show password"}
              >
                {showPwd ? "🙈" : "👁️"}
              </button>
            </div>
            {errors.password?.message && (
              <p className="text-sm text-red-600 bg-red-50 px-2 py-1 rounded">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="space-y-1.5">
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700"
            >
              Confirm Password
            </label>
            <div className="relative">
              <input
                id="confirmPassword"
                type={showConfirm ? "text" : "password"}
                autoComplete="new-password"
                {...register("confirmPassword")}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 shadow-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 pr-10"
                placeholder="Re-enter your password"
                aria-invalid={!!errors.confirmPassword}
              />
              <button
                type="button"
                onClick={() => setShowConfirm((s) => !s)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                aria-label={showConfirm ? "Hide password" : "Show password"}
              >
                {showConfirm ? "🙈" : "👁️"}
              </button>
            </div>
            {errors.confirmPassword?.message && (
              <p className="text-sm text-red-600 bg-red-50 px-2 py-1 rounded">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => navigate("/")}
              className="text-sm text-blue-600 hover:text-blue-700 underline underline-offset-2"
            >
              ← Back to Sign In
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex justify-center items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-white font-semibold shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Updating..." : "Update Password"}
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}
