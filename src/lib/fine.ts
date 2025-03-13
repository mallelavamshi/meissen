import { FineClient } from "@fine-dev/fine-js";

/**
 * This variable will hold the Fine client. It will be populated automatically by Fine when you have a backend set up
 */
export const fine: FineClient = new FineClient({
  apiUrl: import.meta.env.VITE_FINE_API_URL || "https://api.fine.dev",
  apiKey: import.meta.env.VITE_FINE_API_KEY || "",
});