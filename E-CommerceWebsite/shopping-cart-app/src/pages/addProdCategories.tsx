import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { api } from "../axios/axiosClient";
import { Category } from "../types/prodCategory";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import Button from "@mui/material/Button";
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";
import toast from "react-hot-toast";

export const AddProductCategories = () => {
  const navigate = useNavigate();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [values, setValues] = useState({
    prod_category: "",
  });
  //   const [isEditing, setIsEditing] = useState(false);
  const [editingRowId, setEditingRowId] = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState<string>("");
  const [categories, setCategories] = useState<Category[]>([]);

  const handleChange = async (
    name: keyof Pick<Category, "prod_category">,
    raw: string,
  ) => {
    setValues((prev) => {
      return { ...prev, [name]: raw };
    });
  };

  const fetchCategories = async () => {
    try {
      const res = await api.get("/categories");
      setCategories(res.data?.categories || []);
    } catch (err: any) {
      console.error(err);
      if (err.response.status === 401) {
        return;
      }
      const message =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        "Failed to fetch categories";
      console.error(message);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { prod_category } = values;

    if (!prod_category.trim()) {
      toast.error("Please fill in the field.");
      // alert("Please fill in all fields.");
      return;
    }

    try {
      const payload = {
        prod_category: prod_category.trim(),
      };

      const res = await api.post("/add/category", payload);
      const createdProduct = res.data;

      setValues({
        prod_category: "",
      });
      await fetchCategories();
    } catch (err: any) {
      console.error(err);
      if (err.response.status === 401) {
        return;
      }
      const message =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        "Add category failed";
      setErrorMsg(message);
      console.error(message);
    }
  };

  const startEditRow = (categoryId: string, currentName: string) => {
    setEditingRowId(categoryId);
    setEditingValue(currentName);
  };

  const cancelEditRow = () => {
    setEditingRowId(null);
    setEditingValue("");
  };

  const saveRow = async () => {
    if (!editingRowId) return;
    const newName = editingValue.trim();
    if (!newName) {
      toast.error("Category name cannot be empty.");
      // alert("Category name cannot be empty.");
      return;
    }

    const duplicate = categories.some(
      (x) =>
        x.categoryId !== editingRowId &&
        x.prod_category.toLowerCase() === newName.toLowerCase(),
    );
    if (duplicate) {
      toast.error("Category already exists.");
      // alert("Category already exists.");
      return;
    }

    await api.patch(`/category/edit/${editingRowId}`, {
      prod_category: newName,
    });

    setCategories((prev) =>
      prev.map((row) =>
        row.categoryId === editingRowId
          ? { ...row, prod_category: newName }
          : row,
      ),
    );

    setEditingRowId(null);
    setEditingValue("");
  };

  const handleDelete = async (categoryId: string) => {
    try {
      await api.delete(`/category/${categoryId}`);
      setCategories((prev) => prev.filter((c) => c.categoryId !== categoryId));
    } catch {}
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mx-auto my-3 max-w-3xl m-12 grid grid-cols-1">
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-xl shadow-md p-6 border border-violet-300 mx-auto w-full"
        >
          <h1 className="mb-4 text-center font-bold text-xl">
            Add Product Categories
          </h1>
          <div className="flex items-center gap-3">
            <label className="font-semibold w-20">Category: </label>
            <input
              type="text"
              className="p-2 m-3 border-2 w-full mx-2 rounded-xl"
              placeholder="Enter a product category..."
              value={values.prod_category ?? ""}
              onChange={(e) => handleChange("prod_category", e.target.value)}
            />
          </div>

          <div className="flex justify-center gap-3 m-3">
            <button
              type="submit"
              className="text-white bg-pink-400 border-2 px-3 py-2 rounded-xl hover:bg-pink-600"
            >
              Add Product
            </button>
          </div>
        </form>

        <div className="my-5">
          <table className="min-w-full border-collapse border border-gray-200">
            <thead>
              <tr>
                <th>S.no</th>
                <th>Categories List</th>
                <th>Edit Categories</th>
                <th>Delete Categories</th>
              </tr>
            </thead>
            <tbody>
              {categories.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="border border-gray-200 px-3 py-4 text-center text-gray-500"
                  >
                    "No categories yet."
                  </td>
                </tr>
              ) : (
                categories.map((c, idx) => {
                  const rowIsEditing = editingRowId === c.categoryId;
                  return (
                    <tr
                      key={c.categoryId}
                      className="odd:bg-white even:bg-gray-50"
                    >
                      <td className="border border-gray-200 px-3 py-2">
                        {idx + 1}
                      </td>
                      <td className="border border-gray-200 px-3 py-2 font-medium">
                        {rowIsEditing ? (
                          <input
                            type="text"
                            value={editingValue}
                            onChange={(e) => setEditingValue(e.target.value)}
                            className="border rounded px-2 py-1 w-full"
                            autoFocus
                          />
                        ) : (
                          c.prod_category
                        )}
                      </td>
                      <td>
                        <div>
                          {!rowIsEditing ? (
                            <div className="flex justify-center align-center">
                              <Button
                                variant="outlined"
                                color="secondary"
                                size="small"
                                startIcon={<EditIcon fontSize="small" />}
                                onClick={() =>
                                  startEditRow(c.categoryId, c.prod_category)
                                }
                              >
                                Edit
                              </Button>
                            </div>
                          ) : (
                            <div className="flex justify-center align-center gap-3">
                              <Button
                                variant="contained"
                                color="primary"
                                size="small"
                                startIcon={<SaveIcon fontSize="small" />}
                                onClick={saveRow}
                              >
                                Save
                              </Button>

                              <Button
                                variant="outlined"
                                color="inherit"
                                size="small"
                                startIcon={<CloseIcon fontSize="small" />}
                                onClick={cancelEditRow}
                              >
                                Cancel
                              </Button>
                            </div>
                          )}
                        </div>
                      </td>

                      <td className="border border-gray-200 px-3 py-2">
                        <div className="flex justify-center align-center">
                          <Button
                            variant="outlined"
                            size="small"
                            startIcon={<DeleteIcon fontSize="small" />}
                            onClick={() => handleDelete(c.categoryId)}
                            color="error"
                          >
                            Delete
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
