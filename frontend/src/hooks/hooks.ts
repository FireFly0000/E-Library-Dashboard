import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../redux/store";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { RtkResponseError } from "@/types/response";

export const useAppDispatch = () => useDispatch<AppDispatch>();

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

/**
 * Reusable debounce hook to delay value updates
 * @param value - The value to debounce
 * @param delay - Delay in milliseconds
 * @returns Debounced value after the specified delay
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

//Hook to stream RTK query error message to toast
export const useRtkQueryErrorToast = (error: unknown) => {
  useEffect(() => {
    if (error) {
      const err = error as FetchBaseQueryError & { data: RtkResponseError };
      const message = err?.data?.message || "Something went wrong";
      toast.error(message);
    }
  }, [error]);
};

export function useWindowWidth() {
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);

    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return width;
}
