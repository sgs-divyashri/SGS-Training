import { TaskPayload } from "./createTask";
import { FieldConfig } from "./fullUpdateTask";

interface RegisterInputsProps {
  fields: FieldConfig[];
  values: Pick<TaskPayload, "taskName" | "description" | "createdBy" |"status">;
  onChange: (name: keyof Pick<TaskPayload, "taskName" | "description" | "createdBy" | "status">, raw: string) => void;
}

export default function UpdateTaskInputs({ fields, values, onChange}: RegisterInputsProps) {
  return (
    <div>
      {fields.map((f) => (
        <div key={String(f.name)} className="flex items-center gap-4">
          <label className="font-semibold w-28">{f.label}: </label>
          {f.type === "number" ? (
            <input
              type="number"
              className="p-2 m-3 border-2 w-full mx-2 rounded-xl"
              value={values[f.name] === undefined ? "" : (values[f.name] as number)}
              onChange={(e) => onChange(f.name, e.target.value)}
            />
          ) : (
            <input
              type={f.type}
              className="p-2 m-3 border-2 w-full mx-2 rounded-xl"
              value={values[f.name] === undefined ? "" : (values[f.name] as string)}
              onChange={(e) => onChange(f.name, e.target.value)}
            />
          )}
        </div>
      ))}
    </div>
  );
}

