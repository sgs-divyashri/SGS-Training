import { useEffect, useRef, useState, useMemo } from "react";
import { api as http } from "../axios/axiosClient";
import { Product } from "../types/product";
import { Category } from "../types/prodCategory";
import { useCart } from "../context/CartContext";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { AgGridReact } from "ag-grid-react";
import type {
  ColDef,
  GridApi,
  GridReadyEvent,
  ICellRendererParams,
} from "ag-grid-community";
import { getRole, getToken } from "../auth/auth";
import { useNotification } from "../context/NotificationContext";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const defaultColDef: ColDef = {
  sortable: true,
  filter: true,
  floatingFilter: true,
  resizable: true,
};

type GridContext = {
  role: "Admin" | "User" | null;
  onAddToCart: (row: Product) => Promise<void>;
  onDeleteProduct: (row: Product) => Promise<void>;
};

type AddToCartParams = ICellRendererParams & {
  onAdd?: (row: Product) => void;
};

const AddToCartButtonRenderer = (props: AddToCartParams) => {
  const { data, onAdd } = props;

  const stockText = String(data?.inStock ?? "")
    .trim()
    .toLowerCase();
  const isOutOfStock = stockText === "out of stock";

  const handleClick = () => {
    if (!isOutOfStock) {
      onAdd?.(data as Product);
    }
  };

  return (
    <div className="h-full flex items-center justify-center">
      <button
        type="button"
        onClick={handleClick}
        disabled={isOutOfStock}
        className={`px-3 py-1 rounded text-white text-xs ${
          isOutOfStock
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700"
        }`}
        title={isOutOfStock ? "Out of Stock" : "Add to cart"}
      >
        Add
      </button>
    </div>
  );
};

const ActionsRenderer = (params: ICellRendererParams<Product>) => {
  const row = params.data as Product;
  const ctx = params.context as GridContext;

  const isAdmin = ctx.role === "Admin";

  return (
    <div className="flex items-center gap-2 h-full justify-center">
      {isAdmin && (
        <>
          <button
            type="button"
            onClick={() => ctx.onDeleteProduct(row)}
            className="px-2 py-1 rounded bg-rose-600 hover:bg-rose-700 text-white text-xs"
            title="Delete product"
          >
            Delete
          </button>
        </>
      )}
    </div>
  );
};

export const Home = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const role = getRole();
  const token = getToken();
  if(!token){
    navigate("/")
  }

  const handleAddToCart = async (row: Product) => {
    await addToCart({ product: row, quantity: 1 });
  };

  const handleEditProduct = async (params: any) => {
    if (role !== "Admin") return;
    const productId = params.data.productId;
    const field = params.colDef.field;
    const newValue = params.newValue;
    const oldValue = params.oldValue;

    const patch = { [field]: newValue };

    try {
      await http.patch(`/product/edit/${productId}`, patch);
    } catch (err: any) {
      params.node.setDataValue(field, oldValue);
      console.error(err);
      if (err.response.status === 401) {
        return;
      }
      toast.error("Edit failed");
    }
  };

  const handleDeleteProduct = async (row: Product) => {
    try {
      await http.delete(`/product/${row.productId}`);
      setProducts((prev) => prev.filter((p) => p.productId !== row.productId));
      toast.success(`Deleted Product ID: ${row.productId}`);
    } catch (err: any) {
      console.error(err);
      if (err.response.status === 401) {
        return;
      }
      toast.error("Delete failed");
    }
  };

  const handleStockToggle = async (row: Product) => {
    try {
      const res = await http.patch(`/product/toggle/${row.productId}`);
      const updated = res.data.product;

      setProducts((prev) =>
        prev.map((p) =>
          p.productId === updated.productId ? { ...p, ...updated } : p,
        ),
      );
    } catch (err: any) {
      console.error(err);
      if (err.response.status === 401) {
        return;
      }
      toast.error("Stock Update Failed.")
    }
  };

  useEffect(() => {
    http.get("/products").then((res) => {
      setProducts(res.data?.products || []);
    });
  }, []);

  useEffect(() => {
    let active = true;
    http.get("/categories").then((res) => {
      const list = res.data.categories ?? [];
      if (active) setCategories(list);
    });
  }, []);

  // Grid API reference
  const gridApiRef = useRef<GridApi | null>(null);

  const onGridReady = (e: GridReadyEvent) => {
    gridApiRef.current = e.api;
    console.log(gridApiRef.current);
  };

  const gridContext: GridContext = useMemo(
    () => ({
      role,
      onAddToCart: handleAddToCart,
      onDeleteProduct: handleDeleteProduct,
    }),
    [role],
  );

  const columnDefs = useMemo<ColDef<Product>[]>(() => {
    const editableForAdmin = role === "Admin";
    const col: ColDef<Product>[] = [
      {
        field: "p_name",
        headerName: "Name",
        tooltipField: "p_name",
        filter: "agTextColumnFilter",
        sortable: true,
        editable: editableForAdmin,
        flex: 1,
      },
      {
        field: "p_description",
        headerName: "Description",
        tooltipField: "p_description",
        filter: "agTextColumnFilter",
        sortable: true,
        editable: editableForAdmin,
        flex: 2,
      },
      {
        field: "prod_category",
        headerName: "Category",
        filter: "agTextColumnFilter",
        cellEditor: "agSelectCellEditor",
        cellEditorParams: () => ({
          values: categories.map((c) => c.prod_category),
        }),
        sortable: true,
        editable: editableForAdmin,
        width: 120,
      },
      {
        field: "price",
        headerName: "Price (₹)",
        filter: "agNumberColumnFilter",
        sortable: true,
        editable: editableForAdmin,
        width: 120,
        valueFormatter: (p) => `₹ ${Number(p.value).toFixed(2)}`,
      },
      {
        field: "qty",
        headerName: "Quantity",
        filter: "agNumberColumnFilter",
        sortable: true,
        editable: editableForAdmin,
        width: 120,
      },
      {
        field: "inStock",
        headerName: "Stock",
        filter: "agTextColumnFilter",
        editable: false,
        width: 120,
        cellRenderer: (p: ICellRendererParams) => {
          const inStock =
            (p.data?.inStock || "").trim().toLowerCase() === "in stock";
          return (
            <span style={{ color: inStock ? "green" : "red", fontWeight: 600 }}>
              {p.value}
            </span>
          );
        },
        sort: "asc",
      },
    ];

    if (role === "Admin") {
      col.push({
        headerName: "Actions",
        colId: "actions",
        width: 120,
        sortable: false,
        filter: false,
        editable: false,
        cellRenderer: ActionsRenderer,
      });
    } else {
      col.push({
        headerName: "Add To Cart",
        colId: "actionsAdd",
        width: 120,
        pinned: "right",
        sortable: false,
        filter: false,
        editable: false,
        cellRenderer: AddToCartButtonRenderer,
        cellRendererParams: (params: ICellRendererParams) => ({
          onAdd: (row: Product) => (params.context as any)?.onAddToCart?.(row),
        }),
      });
    }

    return col;
  }, [role, categories]);

  const onCellDoubleClicked = (params: any) => {
    const ctx = params.context as GridContext;
    if (ctx.role !== "Admin") return;
    if (params.colDef.field !== "inStock") return;
    handleStockToggle(params.data);
  };

  return (
    <div>
      {role === "Admin" ? (
        <div className="max-w-6xl mx-auto">
          <header className="mb-4">
            <h1 className="text-2xl mt-10 mb-2 font-bold text-gray-900">
              Featured Products
            </h1>
            <p className="text-sm text-gray-600">Browse our latest items</p>
          </header>

          <div
            className="ag-theme-alpine"
            style={{ height: 500, width: "100%" }}
          >
            <AgGridReact<Product>
              rowData={products}
              columnDefs={columnDefs}
              defaultColDef={defaultColDef}
              pagination
              paginationPageSize={30}
              paginationPageSizeSelector={[10, 30, 50, 100]}
              onGridReady={onGridReady}
              getRowId={({ data }) => data.productId}
              theme="legacy"
              tooltipShowDelay={0}
              context={gridContext}
              onCellDoubleClicked={onCellDoubleClicked}
              onCellValueChanged={handleEditProduct}
            />
          </div>
        </div>
      ) : (
        <div className="max-w-6xl mx-auto">
          <header className="mb-4">
            <h1 className="text-2xl mt-10 mb-2 font-bold text-gray-900">
              Featured Products
            </h1>
            <p className="text-sm text-gray-600">Browse our latest items</p>
          </header>

          <div
            className="ag-theme-alpine"
            style={{ height: 500, width: "100%" }}
          >
            <AgGridReact<Product>
              rowData={products}
              columnDefs={columnDefs}
              defaultColDef={defaultColDef}
              pagination
              paginationPageSize={30}
              paginationPageSizeSelector={[10, 30, 50, 100]}
              onGridReady={onGridReady}
              getRowId={({ data }) => data.productId}
              theme="legacy"
              tooltipShowDelay={10}
              context={gridContext}
            />
          </div>
        </div>
      )}
    </div>
  );
};
