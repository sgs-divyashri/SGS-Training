import { FieldConfig, TaskPayload } from "./createTask";

interface RegisterInputsProps {
  fields: FieldConfig[];
  values: Pick<TaskPayload, "taskName" | "description" | "createdBy">;
  onChange: (name: keyof Pick<TaskPayload, "taskName" | "description" | "createdBy">, raw: string) => void;
  createdByOptions?: { value: string; label: string }[];
}

export default function CreateTaskInputs({ fields, values, onChange, createdByOptions = [], }: RegisterInputsProps) {
  return (
    <div>
      {fields.map((f) => (
        <div key={String(f.name)} className="flex items-center gap-4">
          <label className="font-semibold w-28">{f.label}: </label>
          {f.name === "createdBy" ? (
            <select
              className="p-2 m-3 border-2 w-full mx-2 rounded-xl"
              value={values.createdBy === "" ? "" : String(values.createdBy)}
              onChange={(e) => onChange(f.name, e.target.value)}
            >
              <option value="">Select a user (email)</option>
              {createdByOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          ) : (
            <input
              type={f.type}
              className="p-2 m-3 border-2 w-full mx-2 rounded-xl"
              placeholder={f.placeholder}
              // required
              value={values[f.name] === undefined ? "" : (values[f.name] as string)}
              onChange={(e) => onChange(f.name, e.target.value)}
            />
          )}
        </div>
      ))}
    </div>
  );
}

