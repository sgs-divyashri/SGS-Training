import { FieldConfig, UserPayload } from "./register";

interface RegisterInputsProps {
  fields: FieldConfig[];
  values: Pick<UserPayload, "name"|"email"|"password"|"age">;
  onChange: (name: keyof Pick<UserPayload, "name"|"email"|"password"|"age">, raw: string) => void;
  onEmailBlur: () => void; 
}

export default function RegisterInputs({ fields, values, onChange, onEmailBlur }: RegisterInputsProps) {
  return (
    <div>
      {fields.map((f) => (
        <div key={String(f.name)} className="flex items-center gap-4">
          <label className="font-semibold w-24">{f.label}: </label>

          {f.type === "number" ? (
            <input
              type="number"
              min={f.min}
              className="p-2 m-3 border-2 w-full mx-2 rounded-xl"
              placeholder={f.placeholder}
              // required
              value={values[f.name] === undefined ? "" : (values[f.name] as number)}
              onChange={(e) => onChange(f.name, e.target.value)}
            />
          ) : (
            <input
              type={f.type}
              className="p-2 m-3 border-2 w-full mx-2 rounded-xl"
              placeholder={f.placeholder}
              // required
              value={values[f.name] === undefined ? "" : (values[f.name] as string)}
              onChange={(e) => onChange(f.name, e.target.value)}
              onBlur={f.name === "email" ? onEmailBlur : undefined}
            />
          )}
        </div>
      ))}
    </div>
  );
}

