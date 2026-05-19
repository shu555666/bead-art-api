export default async function handler(req, res) {

  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed'
    })
  }

  try {

    const { image } = req.body

    if (!image) {
      return res.status(400).json({
        success: false,
        error: '没有图片'
      })
    }

    // 请求 remove.bg
    const response = await fetch(
      'https://api.remove.bg/v1.0/removebg',
      {
        method: 'POST',
        headers: {
          'X-Api-Key': 'V4BU21zEBvzwE5JB33H8nyd7'
        },
        body: JSON.stringify({
          image_file_b64: image,
          size: 'auto'
        })
      }
    )

    // remove.bg 返回失败
    if (!response.ok) {

      const errorText = await response.text()

      return res.status(500).json({
        success: false,
        error: errorText
      })
    }

    // 获取图片 buffer
    const arrayBuffer = await response.arrayBuffer()

    const base64 = Buffer.from(arrayBuffer).toString('base64')

    // 返回给微信小程序
    return res.status(200).json({
      success: true,
      image: `data:image/png;base64,${base64}`
    })

  } catch (err) {

    return res.status(500).json({
      success: false,
      error: err.message
    })
  }
}
