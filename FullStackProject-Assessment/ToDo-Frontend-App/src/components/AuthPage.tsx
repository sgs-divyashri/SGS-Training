import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import {
    SignInForm,
    signInSchema,
    LoginResponse
} from "../types/authPage";
import { api } from "../axios/axiosClient";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { Field, inputClass } from "../props/authPage";

export const AuthPage = () => {
    const [serverMessage, setServerMessage] = useState<string | null>(null);
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<SignInForm>({
        resolver: joiResolver(signInSchema),
        defaultValues: { role: "", email: "", password: "" },
        mode: "onBlur",
    });

    const onSubmit = async (values: SignInForm) => {
        setServerMessage(null);
        try {
            const body = values as SignInForm;
            const res = await api.post<LoginResponse>("/user/login", body);
            const data = res.data;
            localStorage.setItem("token", data.token);
            const decoded: any = jwtDecode(data.token);
            const role = decoded.role;
            if (role === "Admin") {
                navigate("/manage-board");
            } else {
                navigate("/view-board");
            }
        } catch (err: any) {
            const message = "Something went wrong.";
            setServerMessage(message);
        }
    };

    return (
        <main className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <section className="w-full max-w-md bg-white rounded-2xl shadow-lg">
                <div className="px-6 pt-6">
                    <h1 className="text-2xl font-semibold text-gray-900">
                        Sign In
                    </h1>
                </div>

                {serverMessage && (
                    <div className="px-6 pt-3">
                        <p className="text-sm text-blue-700 bg-blue-50 border border-blue-200 rounded px-3 py-2">
                            {serverMessage}
                        </p>
                    </div>
                )}

                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="px-6 pb-6 pt-4 space-y-4"
                >
                    <Field id="role" label="Role" error={(errors as any)?.role?.message}>
                        <select id="role" className={inputClass} {...register("role")}>
                            <option value="">Select a Role</option>
                            <option value="Admin">Admin</option>
                            <option value="User">User</option>
                        </select>
                    </Field>

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
                            autoComplete={"current-password"}
                            {...register("password")}
                            className={inputClass}
                            placeholder="Enter Password"
                        />
                    </Field>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full inline-flex justify-center items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-white font-semibold shadow hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? "Signing in..." : "Sign In"}
                    </button>
                </form>
            </section>
        </main>
    );
};
