import { NextApiRequest, NextApiResponse } from "next";
import { fine } from "@/lib/fine";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { action, adminId, settings } = req.body;

  if (!action || !adminId || (action === "updateSettings" && (!settings || typeof settings !== "object"))) {
    return res.status(400).json({ error: "Invalid or missing required parameters" });
  }

  try {
    const payload = action === "updateSettings" ? { settings } : {};
    const response = await fine.functions.invoke("manage-settings", {
      action,
      adminId,
      data: payload,
    });

    if (response.error) {
      console.error("Error from fine.functions.invoke:", response.error);
      return res.status(500).json({ error: response.error });
    }

    return res.status(200).json(response.data);
  } catch (error: any) {
    console.error("Unexpected error in manage-settings API:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}