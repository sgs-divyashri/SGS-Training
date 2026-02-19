import React, { useMemo, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import Joi from "joi";
import { joiResolver } from "@hookform/resolvers/joi";
import { FormValues } from "../types/authPage";
import { api } from "../axios/axiosClient";
import { Field, inputClass } from "./authPage";

const schema = Joi.object({
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

export const ResetPassword = () => {
  const [params] = useSearchParams();
  const token = params.get("token");
  const navigate = useNavigate();
  const [serverMsg, setServerMsg] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: joiResolver(schema),
    mode: "onBlur",
    defaultValues: { password: "", confirmPassword: "" },
  });

  const isTokenMissing = useMemo(() => !token, [token]);

  const onSubmit = async (values: FormValues) => {
    setServerMsg(null);
    try {
      const res = await api.post(
        "/users/reset-password",
        {
          password: values.password,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setServerMsg(res?.data?.message || "Password updated successfully.");
      setTimeout(() => navigate("/"), 2000);
    } catch (err: any) {
      const msg =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        err?.message ||
        "Something went wrong.";
      setServerMsg(msg);
    }
  };

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
            type="button"
            className="mt-6 text-blue-600 hover:text-blue-700 underline underline-offset-2"
            onClick={() => navigate("/")}
          >
            Back to Sign In
          </button>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-blue-50 flex items-center justify-center p-4">
      <section className="w-full max-w-lg bg-white rounded-xl shadow p-8">
        <div className="flex justify-center mb-4">
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

        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-5">
          <Field
            id="password"
            label="Password"
            error={(errors as any)?.password?.message}
          >
            <input
              id="password"
              type="password"
              autoComplete="new-password"
              {...register("password")}
              className={inputClass}
              placeholder="Enter Password"
            />
          </Field>

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

          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => navigate("/")}
              className="text-sm text-blue-600 hover:text-blue-700 underline underline-offset-2"
            >
              Back to Sign In
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex justify-center items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-white font-semibold shadow hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Updating..." : "Update Password"}
            </button>
          </div>
        </form>
      </section>
    </main>
  );
};
