import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import Button from "@mui/material/Button";
import DeleteIcon from "@mui/icons-material/Delete";
import { api } from "../axios/axiosClient";

import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { AgGridReact } from "ag-grid-react";
import type { ColDef, ICellRendererParams } from "ag-grid-community";

type Category = {
    categoryId: string;
    prod_category: string;
};

export function AddCategoryForm({
    onClose,
}: {
    onClose: () => void;
}) {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);

    const [name, setName] = useState("");
    const [adding, setAdding] = useState(false);

    const [savingId, setSavingId] = useState<string | null>(null);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const fetchCategories = async () => {
        try {
            setLoading(true);
            const res = await api.get("/categories");
            setCategories(res.data?.categories || []);
        } catch (err: any) {
            if (err?.response?.status === 401) return;
            const message =
                err?.response?.data?.message ||
                err?.response?.data?.error ||
                err?.message ||
                "Failed to fetch categories";
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const addCategory = async (e: React.FormEvent) => {
        e.preventDefault();

        const newName = name.trim();
        if (!newName) {
            toast.error("Please enter a category name.");
            return;
        }

        if (categories.some(c => c.prod_category.toLowerCase() === newName.toLowerCase())) {
            toast.error("Category already exists.");
            return;
        }

        try {
            setAdding(true);
            await api.post("/add/category", { prod_category: newName });
            toast.success("Category added");
            setName("");
            await fetchCategories();
        } catch (err: any) {
            if (err?.response?.status === 401) return;
            const message =
                err?.response?.data?.message ||
                err?.response?.data?.error ||
                err?.message ||
                "Add category failed";
            toast.error(message);
        } finally {
            setAdding(false);
        }
    };

    const onCellValueChanged = async (params: any) => {
        if (params.colDef.field !== "prod_category") return;
        const row: Category = params.data;
        const id = row.categoryId;
        const newName = String(params.newValue || "").trim();
        const oldName = String(params.oldValue || "").trim();

        if (newName === oldName) return;

        if (!newName) {
            toast.error("Category name cannot be empty.");
            params.node.setDataValue("prod_category", oldName);
            return;
        }

        const dupe = categories.some(
            (c) =>
                c.categoryId !== id &&
                c.prod_category.toLowerCase() === newName.toLowerCase(),
        );
        if (dupe) {
            toast.error("Category already exists.");
            params.node.setDataValue("prod_category", oldName);
            return;
        }

        try {
            setSavingId(id);
            await api.patch(`/category/edit/${id}`, { prod_category: newName });
            toast.success("Category updated");
            setCategories(prev =>
                prev.map(c => (c.categoryId === id ? { ...c, prod_category: newName } : c)),
            );
        } catch (err: any) {
            params.node.setDataValue("prod_category", oldName);
            if (err?.response?.status === 401) return;
            const message =
                err?.response?.data?.message ||
                err?.response?.data?.error ||
                err?.message ||
                "Update category failed";
            toast.error(message);
        } finally {
            setSavingId(null);
        }
    };

    const handleDelete = async (row: Category) => {
        try {
            setDeletingId(row.categoryId);
            await api.delete(`/category/${row.categoryId}`);
            setCategories(prev => prev.filter(c => c.categoryId !== row.categoryId));
            toast.success("Deleted");
        } catch (err: any) {
            if (err?.response?.status === 401) return;
            const message =
                err?.response?.data?.message ||
                err?.response?.data?.error ||
                err?.message ||
                "Delete failed";
            toast.error(message);
        } finally {
            setDeletingId(null);
        }
    };

    const defaultColDef = useMemo<ColDef>(
        () => ({
            sortable: true,
            filter: true,
            floatingFilter: true,
            resizable: true,
        }),
        [],
    );

    const columnDefs = useMemo<ColDef<Category>[]>(() => [
        {
            headerName: "S.no",
            valueGetter: (params) => {
                const id = params.data?.categoryId;
                const index = categories.findIndex(c => c.categoryId === id);
                return index + 1;
            },
            width: 80,
            sortable: false,
            filter: false,
            suppressMenu: true,
        },
        {
            field: "prod_category",
            headerName: "Category Name",
            editable: true,
            filter: "agTextColumnFilter",
            flex: 1,
        },
        {
            headerName: "Delete",
            width: 120,
            sortable: false,
            filter: false,
            cellRenderer: (p: ICellRendererParams<Category>) => {
                const row = p.data!;
                const busy = deletingId === row.categoryId || savingId === row.categoryId;
                return (
                    <div className="flex items-center justify-center h-full">
                        <Button
                            variant="outlined"
                            size="small"
                            color="error"
                            startIcon={<DeleteIcon fontSize="small" />}
                            onClick={() => handleDelete(row)}
                            disabled={busy}
                        >
                            {busy ? "..." : "Delete"}
                        </Button>
                    </div>
                );
            },
        },
    ],
        [categories, deletingId, savingId],
    );

    return (
        <div className="w-[550px] max-w-[80vw]">
            <div className="flex items-center justify-between px-5 pt-5">
                <h2 id="modal-title" className="text-lg font-semibold">
                    Manage Categories
                </h2>
            </div>

            <div className="max-h-[70vh] overflow-auto p-5">
                <form onSubmit={addCategory} className="mb-4">
                    <label className="block text-sm font-medium">New Category</label>
                    <div className="mt-2 flex gap-2">
                        <input
                            type="text"
                            className="flex-1 rounded border px-3 py-2"
                            placeholder="Enter a product category..."
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                        <button
                            type="submit"
                            className="px-4 py-2 rounded bg-blue-600 text-white disabled:opacity-60"
                            disabled={adding}
                        >
                            {adding ? "Adding..." : "Add"}
                        </button>
                    </div>
                </form>

                <div className="ag-theme-alpine" style={{ height: 340, width: "100%" }}>
                    <AgGridReact<Category>
                        rowData={categories}
                        columnDefs={columnDefs}
                        defaultColDef={defaultColDef}
                        pagination
                        paginationPageSize={20}
                        getRowId={({ data }) => data.categoryId}
                        tooltipShowDelay={0}
                        onCellValueChanged={onCellValueChanged}
                        theme="legacy"
                    />
                </div>
            </div>
        </div>
    );
}
