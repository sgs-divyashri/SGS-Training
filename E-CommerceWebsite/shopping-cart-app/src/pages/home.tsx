// src/pages/home.tsx
import { useEffect, useRef, useState } from "react";
import { api as http } from "../axios/axiosClient"; // <-- renamed to avoid collision
import { Product } from "../types/product";
import { useCart } from "../context/CartContext";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { AgGridReact } from "ag-grid-react";
import type {
  ColDef,
  GridApi,
  GridReadyEvent,
  FilterModel,
  ColumnState,
  ICellRendererParams,
} from "ag-grid-community";

type SortKey = "relevance" | "priceAsc" | "priceDesc" | "nameAsc" | "nameDesc";

// ---------- Column definitions ----------
const defaultColDef: ColDef = {
  sortable: true,
  filter: true,
  floatingFilter: true,
  resizable: true,
};

type AddToCartParams = ICellRendererParams & {
  onAdd?: (row: Product) => void;
};

function AddToCartButtonRenderer(props: AddToCartParams) {
  const { data, onAdd } = props;

  return (
    <button
      type="button"
      onClick={() => onAdd?.(data)}
      className="px-3 py-1 rounded bg-blue-600 text-white text-xs hover:bg-blue-700"
      title="Add to cart"
    >
      Add
    </button>
  );
}

const columnDefs: ColDef<Product>[] = [
  {
    field: "p_name",
    headerName: "Name",
    filter: "agTextColumnFilter",
    sortable: true,
    flex: 1,
  },
  {
    field: "p_description",
    headerName: "Description",
    filter: "agTextColumnFilter",
    sortable: true,
    flex: 2,
  },
  {
    field: "prod_category",
    headerName: "Category",
    filter: "agTextColumnFilter",
    sortable: true,
    width: 120,
  },
  {
    field: "price",
    headerName: "Price (₹)",
    filter: "agNumberColumnFilter",
    sortable: true,
    width: 140,
    valueFormatter: (p) =>
      `₹ ${Number(p.value ?? 0).toLocaleString("en-IN", {
        maximumFractionDigits: 2,
      })}`,
    comparator: (a, b) => Number(a) - Number(b),
  },

  {
    field: "inStock",
    headerName: "Stock",
    // Use Set filter so users can choose "In Stock"/"Out of Stock"
    filter: "agTextColumnFilter",
    sortable: true,
    width: 140,

    // Pretty display: green + red badges based on value
    cellRenderer: (p: ICellRendererParams<Product>) => {
      const value = (p.value ?? "").toString().trim();
      const isInStock = value.toLowerCase() === "in stock";
      const base =
        "inline-flex items-center justify-center px-2 py-0.5 rounded text-xs font-medium";
      const green = "bg-green-100 text-green-800";
      const red = "bg-red-100 text-red-800";
      const cls = `${base} ${isInStock ? green : red}`;
      return value
    },

    // Make "In Stock" sort before "Out of Stock"
    comparator: (a, b) => {
      const rank = (v: any) =>
        String(v ?? "")
          .toLowerCase()
          .trim() === "in stock"
          ? 0
          : 1;
      return rank(a) - rank(b);
    },
  },
  {
    headerName: "Add To Cart",
    colId: "actions",
    width: 120,
    pinned: "right",
    sortable: false,
    filter: false,
    // suppressHeaderMenuButton: true,
    cellRenderer: AddToCartButtonRenderer,
    cellRendererParams: (params: ICellRendererParams) => ({
      onAdd: (row: Product) => (params.context as any)?.onAddToCart?.(row),
    }),
  },
];

// ---------- Sort & Filter model builders ----------
function sortModel(key: SortKey): ColumnState[] {
  switch (key) {
    case "priceAsc":
      return [{ colId: "price", sort: "asc" }];
    case "priceDesc":
      return [{ colId: "price", sort: "desc" }];
    case "nameAsc":
      return [{ colId: "p_name", sort: "asc" }];
    case "nameDesc":
      return [{ colId: "p_name", sort: "desc" }];
    case "relevance":
    default:
      return [];
  }
}

function buildFilterModelForGrid(
  selectedCategories: string[],
  minPrice?: number,
  maxPrice?: number,
  inStockValue?: "In Stock" | "Out of Stock",
): FilterModel {
  const model: FilterModel = {};

  if (selectedCategories.length > 0) {
    model["prod_category"] = {
      filterType: "set",
      values: selectedCategories,
    } as any;
  }

  if (typeof inStockValue === "string" && inStockValue.length > 0) {
    model["inStock"] = {
      filterType: "set",
      values: [inStockValue],
    } as any;
  }

  if (minPrice !== undefined && maxPrice !== undefined) {
    model["price"] = {
      filterType: "number",
      type: "inRange",
      filter: minPrice,
      filterTo: maxPrice,
    } as any;
  } else if (minPrice !== undefined) {
    model["price"] = {
      filterType: "number",
      type: "greaterThan",
      filter: minPrice,
    } as any;
  } else if (maxPrice !== undefined) {
    model["price"] = {
      filterType: "number",
      type: "lessThan",
      filter: maxPrice,
    } as any;
  }

  return model;
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // External controls (your existing UI state)
  const [search, setSearch] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [minPrice, setMinPrice] = useState<number | undefined>(undefined);
  const [maxPrice, setMaxPrice] = useState<number | undefined>(undefined);
  const [inStockOnly, setInStockOnly] = useState("");
  const [sortBy, setSortBy] = useState<SortKey>("relevance");

  const { addToCart } = useCart(); // <- whatever your CartProvider exposes

  const handleAddToCart = (row: Product) => {
    // You can send the raw product to your reducer: it expects a Product
    // Your reducer will normalize id with getId() (productId in your code)
    addToCart(row);
  };

  // Debounced search (for Quick Filter and/or server q)
  const [debounced, setDebounced] = useState("");
  useEffect(() => {
    const id = setTimeout(() => setDebounced(search.trim().toLowerCase()), 250);
    return () => clearTimeout(id);
  }, [search]);

  // Fetch products
  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await http.get("/products", {
          params: {
            q: debounced || undefined,
            prod_category: selectedCategories.length
              ? selectedCategories
              : undefined,
            minPrice: minPrice ?? undefined,
            maxPrice: maxPrice ?? undefined,
            sort: sortBy,
            page: 1,
            pageSize: 300, // fetch a larger page to enable client pagination
          },
        });

        if (!mounted) return;
        const list = Array.isArray(res.data?.products) ? res.data.products : [];
        setProducts(list as Product[]);
      } catch (err: any) {
        if (!mounted) return;
        const msg =
          err?.response?.data?.error ||
          err?.response?.data?.message ||
          err?.message ||
          "Failed to load products.";
        setError(msg);
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [debounced, selectedCategories, minPrice, maxPrice, sortBy]);

  // Grid API reference
  const gridApiRef = useRef<GridApi | null>(null);

  // Grid ready: apply initial quick filter, sort & filter models

  const onGridReady = (e: GridReadyEvent) => {
    gridApiRef.current = e.api;
    e.api.setGridOption("context", { onAddToCart: handleAddToCart });

    // Quick Filter
    e.api.setGridOption("quickFilterText", debounced);

    // Sorting / Column state
    e.api.applyColumnState({
      state: sortModel(sortBy),
      defaultState: { sort: null },
    });

    // Filters
    e.api.setFilterModel(
      buildFilterModelForGrid(selectedCategories, minPrice, maxPrice),
    );
    // No need for onFilterChanged in v31 when using setFilterModel
  };

  // Keep Quick Filter in sync with search box
  useEffect(() => {
    gridApiRef.current?.setGridOption("quickFilterText", debounced);
  }, [debounced]);

  // Keep grid filters in sync with category/price state

  useEffect(() => {
    const api = gridApiRef.current;
    if (!api) return;

    api.setFilterModel(
      buildFilterModelForGrid(selectedCategories, minPrice, maxPrice),
    );
  }, [selectedCategories, minPrice, maxPrice]);

  useEffect(() => {
    const api = gridApiRef.current;
    if (!api) return;

    api.applyColumnState({
      state: sortModel(sortBy),
      defaultState: { sort: null },
    });
  }, [sortBy]);

  // Clear filters resets both UI state and grid state
  const clearFilters = () => {
    setSelectedCategories([]);
    setMinPrice(undefined);
    setMaxPrice(undefined);
    setInStockOnly("");
    setSortBy("relevance");
    setSearch("");

    const api = gridApiRef.current;
    if (api) {
      // clear quick filter
      api.setGridOption("quickFilterText", "");

      // clear column filters
      api.setFilterModel(null); // null clears all filters (v31+)

      // Clear sorts
      api.applyColumnState({
        state: [],
        defaultState: { sort: null },
      });
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <header className="mb-4">
        <h1 className="text-2xl mt-10 mb-2 font-bold text-gray-900">
          Featured Products
        </h1>
        <p className="text-sm text-gray-600">Browse our latest items</p>
      </header>

      {/* AG Grid table */}
      <div className="ag-theme-alpine" style={{ height: 600, width: "100%" }}>
        <AgGridReact<Product>
          rowData={products}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          animateRows
          pagination
          paginationPageSize={30}
          paginationPageSizeSelector={[10, 30, 50, 100]} // keep page-size dropdown aligned
          onGridReady={onGridReady}
          getRowId={({ data }) => data.productId}
          theme="legacy"
        />
      </div>

      {loading && <div className="mt-3 text-sm text-gray-600">Loading…</div>}
      {!loading && error && (
        <div className="mt-3 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
          {error}
        </div>
      )}
    </div>
  );
}
