import { FineClient } from "@fine-dev/fine-js";

/**
 * This variable will hold the Fine client. It will be populated automatically by Fine when you have a backend set up
 */
export const fine: FineClient = new FineClient({
  apiUrl: process.env.FINE_API_URL || "https://api.fine.dev",
  apiKey: process.env.FINE_API_KEY || "",
});