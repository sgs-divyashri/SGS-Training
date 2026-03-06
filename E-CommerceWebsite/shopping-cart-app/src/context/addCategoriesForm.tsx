import { useState } from "react";
import toast from "react-hot-toast";
import { api } from "../axios/axiosClient";

export function AddCategoryForm({
  onCancel,
  onSuccess,
}: {
  onCancel: () => void;
  onSuccess: () => Promise<void> | void;
}) {
  const [name, setName] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newName = name.trim();
    if (!newName) {
      toast.error("Please enter a category name.");
      return;
    }

    try {
      setSubmitting(true);
      await api.post("/add/category", { prod_category: newName });
      toast.success("Category added");
      await onSuccess(); // parent will refresh list
      onCancel(); // close modal
    } catch (err: any) {
      const message =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "Add category failed";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-5 w-[380px] max-w-full">
      <h2 className="text-lg font-semibold mb-4">Add Category</h2>

      <label className="block text-sm font-medium">Category Name</label>
      <input
        type="text"
        className="mt-1 w-full rounded border px-3 py-2"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Enter a product category..."
        autoFocus
      />

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