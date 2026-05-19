import { removeBackground } from "@imgly/background-removal";

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "10mb",
    },
  },
};

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({
        error: "Only POST requests allowed",
      });
    }

    const { image } = req.body;

    if (!image) {
      return res.status(400).json({
        error: "No image provided",
      });
    }

    // base64 转 buffer
    const base64Data = image.replace(
      /^data:image\/\w+;base64,/,
      ""
    );

    const buffer = Buffer.from(base64Data, "base64");

    // AI 抠图
    const blob = await removeBackground(buffer);

    // 转 buffer
    const arrayBuffer = await blob.arrayBuffer();
    const outputBuffer = Buffer.from(arrayBuffer);

    // 返回 PNG
    res.setHeader("Content-Type", "image/png");
    res.status(200).send(outputBuffer);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Background removal failed",
      detail: error.message,
    });
  }
}
