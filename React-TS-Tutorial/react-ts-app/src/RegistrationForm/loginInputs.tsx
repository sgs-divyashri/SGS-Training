import { useState } from "react"
import { useNavigate } from "react-router-dom";
import { FieldConfig } from "./loginForm";
import { UserPayload } from "./registerForm";

interface RegisterInputsProps {
    fields: FieldConfig[];
    values: Pick<UserPayload, "email" | "password">;
    onChange: (name: keyof Pick<UserPayload, "email" | "password">, raw: string) => void;
}

export default function LoginInputs({ fields, values, onChange }: RegisterInputsProps) {
    return (
        <div>
            {fields.map((f) => (
                <div key={String(f.name)} className="flex items-center gap-4">
                    <label className="font-semibold w-24">{f.label}: </label>
                    <input
                        type={f.type}
                        className="p-2 m-3 border-2 w-full mx-2 rounded-xl"
                        placeholder={f.placeholder}
                        required
                        value={values[f.name] === undefined ? "" : (values[f.name] as string)}
                        onChange={(e) => onChange(f.name, e.target.value)}
                    />
                </div>
            ))}
        </div>
    );
}