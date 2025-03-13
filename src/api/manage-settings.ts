import { NextApiRequest, NextApiResponse } from "next";
import { FineClient } from "@fine-dev/fine-js";

const fine = new FineClient({
  apiUrl: process.env.VITE_FINE_API_URL || "https://api.fine.dev",
  apiKey: process.env.VITE_FINE_API_KEY || "",
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { action, adminId, settings } = req.body;

  if (!action || !adminId || (action === "updateSettings" && !settings)) {
    return res.status(400).json({ error: "Missing required parameters" });
  }

  try {
    const response = await fine.invoke("manage-settings", {
      action,
      adminId,
      settings,
    });

    if (response.error) {
      return res.status(500).json({ error: response.error });
    }

    return res.status(200).json(response.data);
  } catch (error: any) {
    console.error("Error in manage-settings API:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}