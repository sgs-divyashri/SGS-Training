
// src/pages/home.tsx
import { useEffect, useMemo, useState } from "react";
import { api } from "../axios/axiosClient";
import ProductCard from "../components/ProductCard";
import { Product } from "../types/product";

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    let mounted = true;

    async function fetchProducts() {
      setLoading(true);
      setError(null);
      try {
        const res = await api.get("/products");
        if (!mounted) return;

        // { message: string, products: Product[] }
        const list = Array.isArray(res.data?.products) ? res.data.products : [];
        const active = list.filter((p: any) => p?.isActive !== false);
        setProducts(active);
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
    }

    fetchProducts();
    return () => {
      mounted = false;
    };
  }, []);

  // Debounce search input (simple client-side debounce)
  const [debounced, setDebounced] = useState("");
  useEffect(() => {
    const id = setTimeout(() => setDebounced(search.trim().toLowerCase()), 250);
    return () => clearTimeout(id);
  }, [search]);

  // Compute filtered products
  const filtered = useMemo(() => {
    if (!debounced) return products;
    return products.filter((p) => {
      const name = (p as any).p_name ?? (p as any).name ?? "";
      const desc = (p as any).p_description ?? "";
      return (
        String(name).toLowerCase().includes(debounced) ||
        String(desc).toLowerCase().includes(debounced)
      );
    });
  }, [products, debounced]);

  return (
    <div className="max-w-6xl mx-auto">
      <header className="mb-4">
        <h1 className="text-2xl mt-10 mb-2 font-bold text-gray-900">Featured Products</h1>
        <p className="text-sm text-gray-600">Browse our latest items</p>
      </header>

      {/* Search bar */}
      <div className="mb-6">
        <div className="relative">
          {/* Search icon (left) */}
          <div className="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center">
            <svg
              className="h-5 w-5 text-gray-400"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M12.9 14.32a8 8 0 111.414-1.414l3.387 3.387a1 1 0 01-1.414 1.414l-3.387-3.387zM8 14a6 6 0 100-12 6 6 0 000 12z"
                clipRule="evenodd"
              />
            </svg>
          </div>

          <input
            type="text"
            inputMode="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or description…"
            aria-label="Search products"
            className="block w-full rounded-lg border border-gray-300 pl-10 pr-10 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />

          {/* Clear button (right) */}
          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
              aria-label="Clear search"
              title="Clear"
            >
              <svg
                className="h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 011.414
                  1.414L11.414 10l4.293 4.293a1 1 0 01-1.414
                  1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586
                  10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          )}
        </div>
      </div>

      {loading && <ProductGridSkeleton />}

      {!loading && error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
          {error}
        </div>
      )}

      {!loading && !error && filtered.length === 0 && (
        <div className="rounded-lg border border-gray-200 bg-white p-4 text-gray-700">
          {search
            ? `No results for "${search}".`
            : "No products available right now."}
        </div>
      )}

      {!loading && !error && filtered.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((p: any, i: number) => (
            <ProductCard key={p.productId ?? p.id ?? p.sku ?? i} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}

/* Skeleton grid while loading */
function ProductGridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="rounded-xl border border-gray-200 bg-white shadow-sm p-4 animate-pulse"
        >
          <div className="h-5 w-3/5 bg-gray-200 rounded mb-2"></div>
          <div className="h-4 w-full bg-gray-200 rounded mb-1"></div>
          <div className="h-4 w-5/6 bg-gray-200 rounded mb-1"></div>
          <div className="h-4 w-4/6 bg-gray-200 rounded mb-3"></div>
          <div className="flex justify-between">
            <div className="h-6 w-20 bg-gray-200 rounded"></div>
            <div className="h-8 w-24 bg-gray-200 rounded"></div>
          </div>
        </div>
      ))}
    </div>
  );
}
