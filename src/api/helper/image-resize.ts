import sharp from 'sharp'
import fs from 'fs'
interface IImageOptions {
  filepath: string
  height: number
  width: number
}
const ProductImageResize = (opt: IImageOptions) => {
  try {
    const {
      filepath,
      height,
      width
    } = opt
    // const file = fs.readFileSync(filepath, 'base64')
    return sharp(filepath)
      .resize(width, height)
      .png()
  } catch (error) {
    throw error
  }
}
export default ProductImageResize