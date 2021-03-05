import { execSync } from 'child_process'
interface IOption {
  skipTime?: number
  duration?: number
  scale?: number
}
const generateGIFFromVideo = (filepath: string, filesaveTo: string, option:IOption = {}) => {
  const {
    duration = 15,
    skipTime = 0,
    scale=250
  } = option
  try {
    const cmd = `ffmpeg -v warning -y`
    + ` -ss ${skipTime}`
    + ` -t ${duration}`
    + ` -i ${filepath}`
    + ` -vf "fps=10,scale=${scale}:-1:flags=lanczos,split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse"`
    + ` -loop 0`
    + ` ${filesaveTo}`
    const result = execSync(cmd)
    return result
  } catch (e) {
    console.log(e);
    console.log(e.msg);
  }
}
export default generateGIFFromVideo