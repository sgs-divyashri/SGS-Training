import { TaskPayload } from "./createTask";
import { FieldConfig } from "./fullUpdateTask";

interface RegisterInputsProps {
  fields: FieldConfig[];
  values: Pick<TaskPayload, "taskName" | "description" | "createdBy" | "status">;
  onChange: (name: keyof Pick<TaskPayload, "taskName" | "description" | "createdBy" | "status">, raw: string) => void;
  createdByOptions?: { value: string; label: string }[];
}

const STATUS_OPTIONS = [
  { value: "To-Do", label: "To-Do" },
  { value: "In Progress", label: "In Progress" },
  { value: "Review", label: "Review" },
  { value: "Completed", label: "Completed" },
];

export default function UpdateTaskInputs({ fields, values, onChange, createdByOptions = [], }: RegisterInputsProps) {
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
              {createdByOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          ) : f.name === "status" ? (
            <select
              className="p-2 m-3 border-2 w-full mx-2 rounded-xl"
              value={values.status === "" ? "" : String(values.status)}
              onChange={(e) => onChange(f.name, e.target.value)}
            >
              <option value=""></option>
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          ) : (
            <input
              type={f.type}
              className="p-2 m-3 border-2 w-full mx-2 rounded-xl"
              value={values[f.name] === undefined ? "" : (values[f.name] as string)}
              onChange={(e) => onChange(f.name, e.target.value)}
            />
          )}
        </div>
      ))
      }
    </div >
  );
}

