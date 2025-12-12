import { FieldConfig, UserPayload } from "./registerForm";

interface RegisterInputsProps {
  fields: FieldConfig[];
  values: Pick<UserPayload, "name"|"email"|"password"|"age">;
  onChange: (name: keyof Pick<UserPayload, "name"|"email"|"password"|"age">, raw: string) => void;
}

export default function RegisterInputs({ fields, values, onChange }: RegisterInputsProps) {
  return (
    <div>
      {fields.map((f) => {
        const value = values[f.name];

        const commonProps = {
          className: "p-2 m-3 border-2 w-full mx-2 rounded-xl",
          placeholder: f.placeholder,
          required: true,
          value: value === undefined ? "" : value as string | number,
          onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
            onChange(f.name, e.target.value);
          },
        };

        return (
          <div key={String(f.name)} className="flex items-center gap-4">
            <label className="font-semibold w-24">{f.label}: </label>

            {f.type === "number" ? (
              <input
                type="number"
                min={f.min}
                {...commonProps}
              />
            ) : (
              <input type={f.type} {...commonProps} />
            )}
          </div>
        );
      })}
    </div>
  );
}
