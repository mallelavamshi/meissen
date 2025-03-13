import { NextApiRequest, NextApiResponse } from "next";
import { fine } from "@/lib/fine";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { imageData } = req.body;

  if (!imageData) {
    return res.status(400).json({ error: "Missing image data" });
  }

  try {
    const response = await fine.functions.invoke("analyze-image", { imageData });

    if (response.error) {
      console.error("Error from fine.functions.invoke:", response.error);
      return res.status(500).json({ error: response.error });
    }

    return res.status(200).json(response.data);
  } catch (error: any) {
    console.error("Unexpected error in analyze-image API:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
