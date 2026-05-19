export const config = {
  api: {
    bodyParser: {
      sizeLimit: "10mb",
    },
  },
};

const API_KEY = "V4BU21zEBvzwE5JB33H8nyd7";

export default async function handler(req, res) {

  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Only POST requests allowed",
    });
  }

  try {

    const { image } = req.body;

    if (!image) {
      return res.status(400).json({
        error: "No image provided",
      });
    }

    // 去掉 base64 前缀
    const base64Data = image.replace(
      /^data:image\/\w+;base64,/,
      ""
    );

    // 转 buffer
    const buffer = Buffer.from(base64Data, "base64");

    // 转 formData
    const formData = new FormData();

    formData.append(
      "image_file",
      new Blob([buffer]),
      "image.png"
    );

    formData.append("size", "auto");

    // 调用 remove.bg API
    const response = await fetch(
      "https://api.remove.bg/v1.0/removebg",
      {
        method: "POST",

        headers: {
          "X-Api-Key": API_KEY,
        },

        body: formData,
      }
    );

    if (!response.ok) {

      const text = await response.text();

      return res.status(500).json({
        error: "remove.bg API failed",
        detail: text,
      });
    }

    // 获取抠图后的图片
    const arrayBuffer = await response.arrayBuffer();

    const outputBuffer = Buffer.from(arrayBuffer);

    // 返回 PNG
    res.setHeader("Content-Type", "image/png");

    return res.status(200).send(outputBuffer);

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      error: "Background removal failed",
      detail: error.message,
    });
  }
}
