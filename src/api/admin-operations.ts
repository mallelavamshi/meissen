import { NextApiRequest, NextApiResponse } from "next";
import { fine } from "@/lib/fine";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { action, adminId, data } = req.body;

  if (!action || !adminId) {
    return res.status(400).json({ error: "Missing required parameters" });
  }

  try {
    const response = await fine.functions.invoke("admin-operations", {
      action,
      adminId,
      data,
    });

    if (!response || response.error) {
      const errorMessage = response?.error || "Unknown error occurred";
      console.error("Error from fine.functions.invoke:", errorMessage);
      return res.status(500).json({ error: errorMessage });
    }

    return res.status(200).json(response.data || { message: "Operation completed successfully" });
  } catch (error: any) {
    console.error("Error in admin operations API:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}