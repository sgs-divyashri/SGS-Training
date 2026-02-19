import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { api } from "../axios/axiosClient";
import { Product } from "../types/product";
import { AddProductInputs } from "../context/addProductInputs";
import toast from "react-hot-toast";

export type FieldType = "text" | "number";

export interface FieldConfig {
  name: keyof Pick<
    Product,
    "p_name" | "p_description" | "prod_category" | "price" | "qty"
  >;
  label: string;
  type?: FieldType;
  placeholder?: string;
}

export const fields: FieldConfig[] = [
  {
    name: "p_name",
    label: "Product Name",
    type: "text",
    placeholder: "Enter Product Name",
  },
  {
    name: "p_description",
    label: "Product Description",
    type: "text",
    placeholder: "Enter Product Description",
  },
  {
    name: "prod_category",
    label: "Product Category",
    // type: "text",
    // placeholder: "Enter Product Category",
  },
  { name: "price", label: "Price", type: "number", placeholder: "Enter Price" },
  {
    name: "qty",
    label: "Quantity",
    type: "number",
    placeholder: "Enter quantity",
  },
];

export const AddProduct = () => {
  const navigate = useNavigate();

  const [values, setValues] = useState({
    p_name: "",
    p_description: "",
    prod_category: "",
    price: "",
    qty: "",
  });
  const [categoryOptions, setCategoryOptions] = useState<
    { value: string; label: string }[]
  >([]);
  const [product, setProduct] = useState<Product[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get("/categories");
        const normalized = res.data?.categories ?? [];
        const opts = (normalized || []).map((c: any) => ({
          value: String(c.prod_category),
          label: String(c.prod_category),
        }));
        setCategoryOptions(opts);
      } catch (err: any) {
        console.error(err);
        if (err.response.status === 401) {
          return;
        }
        const message =
          err.response?.data?.message ||
          err.response?.data?.error ||
          err.message ||
          "Failed to load users";
        console.error(message);
      }
    };
    fetchUsers();
  }, []);

  const handleChange = async (
    name: keyof Pick<
      Product,
      "p_name" | "p_description" | "prod_category" | "price" | "qty"
    >,
    raw: string,
  ) => {
    setValues((prev) => {
      return { ...prev, [name]: raw };
    });
  };

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
      const payload = {
        p_name: p_name.trim(),
        p_description: p_description.trim(),
        categoryId: prod_category.trim(),
        price: priceNum,
        qty: qtyNum
      };

      const res = await api.post("/add", payload);
      const createdProduct = res.data;

      setProduct((prev) => [createdProduct, ...prev]);

      setValues({
        p_name: "",
        p_description: "",
        prod_category: "",
        price: "",
        qty: "",
      });
      navigate(`/home`);
    } catch (err: any) {
      console.error(err);
      if (err.response.status === 401) {
        return;
      }
      const message =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        "Add product failed";
      console.error(message);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mx-auto max-w-3xl m-12 grid grid-cols-1">
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-xl shadow-md p-6 border border-violet-300 mx-auto w-full"
        >
          <h1 className="mb-4 text-center font-bold text-xl">Add Product</h1>
          <AddProductInputs
            fields={fields}
            values={values}
            onChange={handleChange}
            categoryOptions={categoryOptions}
          />
          <div className="flex justify-center gap-3 m-3">
            <button
              type="submit"
              className="text-white bg-pink-400 border-2 px-3 py-2 rounded-xl hover:bg-pink-600"
            >
              Add Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
