import React, { useState } from "react";
import toast from "react-hot-toast";
import { api } from "../axios/axiosClient";
import { Product } from "../types/product";

type FormValues = {
  p_name: string;
  p_description: string;
  prod_category: string; 
  price: string;
  qty: string;
};

type Option = { value: string; label: string };

export function AddProductInputs({
  categoryOptions,
  onSuccess,
  onCancel,
}: {
  categoryOptions: Option[];
  onSuccess: () => void;
  onCancel: () => void;
}) {
  const [values, setValues] = useState<FormValues>({
    p_name: "",
    p_description: "",
    prod_category: "",
    price: "",
    qty: "",
  });
  const [product, setProduct] = useState<Product[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const set = (key: keyof FormValues) => (v: string) =>
    setValues((prev) => ({ ...prev, [key]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { p_name, p_description, prod_category, price, qty } = values;

    if (
      !p_name.trim() ||
      !p_description.trim() ||
      !prod_category.trim() ||
      !price.trim() ||
      !qty.trim()
    ) {
      toast.error("Please fill in all fields.");
      return;
    }

    const priceNum = Number(price);
    if (!Number.isFinite(priceNum) || priceNum < 0) {
      toast.error("Enter a valid price.");
      return;
    }

    const qtyNum = Number(qty);
    if (!Number.isFinite(qtyNum) || qtyNum < 0) {
      toast.error("Enter a valid quantity.");
      return;
    }

    try {
      setSubmitting(true);

      const payload = {
        p_name: p_name.trim(),
        p_description: p_description.trim(),
        categoryId: prod_category.trim(), // backend expects categoryId here in your code
        price: priceNum,
        qty: qtyNum,
      };

      const res = await api.post("/add", payload);
       const createdProduct = res.data;

      setProduct((prev) => [createdProduct, ...prev]);

      toast.success("Product added");
      onSuccess(); 
    } catch (err: any) {
      const message =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "Add product failed";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-5">
      <h2 id="modal-title" className="text-lg font-semibold mb-4">
        Add Product
      </h2>

      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium">Product Name</label>
          <input
            className="mt-1 w-full rounded border px-3 py-2"
            value={values.p_name}
            onChange={(e) => set("p_name")(e.target.value)}
            placeholder="Enter Product Name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Product Description</label>
          <input
            className="mt-1 w-full rounded border px-3 py-2"
            value={values.p_description}
            onChange={(e) => set("p_description")(e.target.value)}
            placeholder="Enter Product Description"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Product Category</label>
          <select
            className="mt-1 w-full rounded border px-3 py-2"
            value={values.prod_category}
            onChange={(e) => set("prod_category")(e.target.value)}
          >
            <option value="" disabled>
              Select a product category
            </option>
            {categoryOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium">Price</label>
            <input
              type="number"
              className="mt-1 w-full rounded border px-3 py-2"
              value={values.price}
              onChange={(e) => set("price")(e.target.value)}
              placeholder="Enter Price"
              min={0}
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Quantity</label>
            <input
              type="number"
              className="mt-1 w-full rounded border px-3 py-2"
              value={values.qty}
              onChange={(e) => set("qty")(e.target.value)}
              placeholder="Enter quantity"
              min={0}
            />
          </div>
        </div>
      </div>

      <div className="mt-5 flex justify-end gap-2">
        <button
          type="button"
          className="px-4 py-2 rounded border"
          onClick={onCancel}
          disabled={submitting}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 rounded bg-blue-600 text-white disabled:opacity-60"
          disabled={submitting}
        >
          {submitting ? "Adding..." : "Add"}
        </button>
      </div>
    </form>
  );
}











// import { Modal } from "../modal/modal";
// import { FieldConfig } from "../pages/addProducts";
// import { Product } from "../types/product";

// interface RegisterInputsProps {
//   // open: boolean;
//   // onClose: () => void;
//   fields: FieldConfig[];
//   values: Pick<
//     Product,
//     "p_name" | "p_description" | "prod_category" | "price" | "total_quantity"
//   >;
//   onChange: (
//     name: keyof Pick<
//       Product,
//       "p_name" | "p_description" | "prod_category" | "price" | "total_quantity"
//     >,
//     raw: string,
//   ) => void;
//   categoryOptions?: { value: string; label: string }[];
// }

// export const AddProductInputs = ({
//   fields,
//   values,
//   onChange,
//   categoryOptions,
// }: RegisterInputsProps) => {
//   return (
//     <Modal open={open} onClose={onClose}>
//       <div>
//         {fields.map((f) => (
//           <div key={String(f.name)} className="flex items-center gap-4">
//             <label className="font-semibold w-50">{f.label}: </label>
//             {f.name === "price" ? (
//               <input
//                 type={f.type}
//                 className="p-2 m-3 border-2 w-full mx-2 rounded-xl"
//                 placeholder={f.placeholder}
//                 value={values.price ?? ""}
//                 onChange={(e) => onChange(f.name as "price", e.target.value)}
//               />
//             ) : f.name === "prod_category" ? (
//               <select
//                 className="p-2 m-3 border-2 w-full mx-2 rounded-xl"
//                 value={values.prod_category ?? ""}
//                 onChange={(e) => onChange(f.name, e.target.value)}
//               >
//                 <option value="" disabled>
//                   Select a product category
//                 </option>
//                 {categoryOptions?.map((opt) => (
//                   <option key={opt.value} value={opt.value}>
//                     {opt.label}
//                   </option>
//                 ))}
//               </select>
//             ) : f.name === "total_quantity" ? (
//               <input
//                 type={f.type}
//                 className="p-2 m-3 border-2 w-full mx-2 rounded-xl"
//                 placeholder={f.placeholder}
//                 value={values.total_quantity ?? ""}
//                 onChange={(e) => onChange(f.name as "total_quantity", e.target.value)}
//               />
//             ) : (
//               <input
//                 type={f.type}
//                 className="p-2 m-3 border-2 w-full mx-2 rounded-xl"
//                 placeholder={f.placeholder}
//                 value={
//                   values[f.name] === undefined ? "" : (values[f.name] as string)
//                 }
//                 onChange={(e) => onChange(f.name, e.target.value)}
//               />
//             )}
//           </div>
//         ))}
//       </div>
//     </Modal>
//   );
// };
