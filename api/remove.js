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

          'X-Api-Key': 'V4BU21zEBvzwE5JB33H8nyd7',

          'Content-Type': 'application/json'

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

      console.error('remove.bg错误：', errorText)

      return res.status(500).json({

        success: false,

        error: errorText

      })

    }

    // 获取图片buffer
    const arrayBuffer = await response.arrayBuffer()

    // 转base64
    const base64 = Buffer
      .from(arrayBuffer)
      .toString('base64')

    // 返回微信小程序
    return res.status(200).json({

      success: true,

      image: `data:image/png;base64,${base64}`

    })

  } catch (err) {

    console.error(err)

    return res.status(500).json({

      success: false,

      error: err.message

    })

  }

}
