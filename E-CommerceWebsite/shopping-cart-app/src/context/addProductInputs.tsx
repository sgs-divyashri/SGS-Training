import { FieldConfig } from "../pages/addProducts";
import { Product } from "../types/product";

interface RegisterInputsProps {
  fields: FieldConfig[];
  values: Pick<
    Product,
    "p_name" | "p_description" | "prod_category" | "price" | "qty"
  >;
  onChange: (
    name: keyof Pick<
      Product,
      "p_name" | "p_description" | "prod_category" | "price" | "qty"
    >,
    raw: string,
  ) => void;
  categoryOptions?: { value: string; label: string }[];
}

export const AddProductInputs = ({
  fields,
  values,
  onChange,
  categoryOptions,
}: RegisterInputsProps) => {
  return (
    <div>
      {fields.map((f) => (
        <div key={String(f.name)} className="flex items-center gap-4">
          <label className="font-semibold w-50">{f.label}: </label>
          {f.name === "price" ? (
            <input
              type={f.type}
              className="p-2 m-3 border-2 w-full mx-2 rounded-xl"
              placeholder={f.placeholder}
              value={values.price ?? ""}
              onChange={(e) => onChange(f.name as "price", e.target.value)}
            />
          ) : f.name === "prod_category" ? (
            <select
              className="p-2 m-3 border-2 w-full mx-2 rounded-xl"
              value={values.prod_category ?? ""}
              onChange={(e) => onChange(f.name, e.target.value)}
            >
              <option value="" disabled>
                Select a product category
              </option>
              {categoryOptions?.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          ) : f.name === "qty" ? (
            <input
              type={f.type}
              className="p-2 m-3 border-2 w-full mx-2 rounded-xl"
              placeholder={f.placeholder}
              value={values.qty ?? ""}
              onChange={(e) => onChange(f.name as "qty", e.target.value)}
            />
          ) : (
            <input
              type={f.type}
              className="p-2 m-3 border-2 w-full mx-2 rounded-xl"
              placeholder={f.placeholder}
              value={
                values[f.name] === undefined ? "" : (values[f.name] as string)
              }
              onChange={(e) => onChange(f.name, e.target.value)}
            />
          )}
        </div>
      ))}
    </div>
  );
};
