import sharp from 'sharp'
import fs from 'fs'
import { IImageResizeOption } from '../domain/interfaces'
const ProductImageResize = async (opt: IImageResizeOption) => {
  try {
    const {
      filepath,
      newFilepath,
      height = undefined,
      width
    } = opt
    // const file = fs.readFileSync(filepath, 'base64')
    await sharp(filepath)
      .resize(width, height)
      .png()
      .toFile(newFilepath)
    return newFilepath
  } catch (error) {
    throw error
  }
}
export default ProductImageResize