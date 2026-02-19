
// useFetchJson.ts

"use client";

import { useEffect, useState } from "react";

/**
 * Fetch JSON from a URL and return data (as an array), loading, and error state.
 * 
 * Usage:
 *   const { data, loading, error } = useFetchJson<IOlympicData>(url);
 *   // data is IOlympicData[] | undefined
 */
export function useFetchJson<T = unknown>(url: string) {
  const [data, setData] = useState<T[] | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | undefined>(undefined);

  useEffect(() => {
    if (!url) {
      setData(undefined);
      setLoading(false);
      setError(new Error("Missing URL"));
      return;
    }

    const controller = new AbortController();
    const { signal } = controller;

    let active = true; // extra guard to avoid state updates after unmount

    async function run() {
      try {
        setLoading(true);
        setError(undefined);

        const res = await fetch(url, {
          method: "GET",
          signal,
          headers: {
            Accept: "application/json",
          },
          // You can tweak caching if desired:
          // cache: "force-cache" | "no-store" | "reload" | "no-cache" | "only-if-cached"
        });

        if (!res.ok) {
          throw new Error(`Request failed: ${res.status} ${res.statusText}`);
        }

        const json = (await res.json()) as T[] | T;

        // The Olympic dataset returns an array.
        // If you ever fetch a single object, normalize to array here if needed.
        const normalized = Array.isArray(json) ? json : [json];

        if (active) {
          setData(normalized as T[]);
          setLoading(false);
        }
      } catch (err: any) {
        if (err?.name === "AbortError") {
          // fetch aborted; no state updates
          return;
        }
        if (active) {
          setError(err instanceof Error ? err : new Error(String(err)));
          setLoading(false);
        }
      }
    }

    run();

    return () => {
      active = false;
      controller.abort();
    };
  }, [url]);

  return { data, loading, error };
}
