import {Request, Response, NextFunction, Router} from 'express'
import fs from 'fs'
import Busboy from 'busboy'
import path from 'path'
const mediaPattern = /^(image\/png|video\/mp4)$/i
const blobLoc = path.join(__dirname, '../../../public/uploaded');

const getBlobpath = (fileId: string) => {
  return `${blobLoc}/${fileId}`
}
export const BlobUploaderMiddleware = (req: Request, res: Response, next: NextFunction) => {
  var busboy = new Busboy({ headers: req.headers });
  const fileId = req.headers['x-file-id'] as string
  const fileSize = parseInt(req.headers['x-file-size'] as string)
  const mimetype = req.headers['x-file-mimetype'] as string
  busboy.on('file', (fieldname, file, filename, encoding) => {
    const blobFlag = fs.existsSync(getBlobpath(fileId)) ? 'a' : 'w'
    file.pipe(fs.createWriteStream(getBlobpath(fileId), {flags: blobFlag}));
    file.on('end', () => {
      const stats = fs.statSync(getBlobpath(fileId))
      if (stats.size === fileSize) {
        req.file = {
          filename,
          fieldname,
          encoding,
          mimetype,
        //@ts-expect-error
          location: blobLoc,
          path: getBlobpath(fileId),
        }
        next()
        return
      } else {
        res.sendStatus(201)
      }
    });
  });
  req.pipe(busboy)
}

export const BlobTotalLoaded = (req: Request, res: Response, next: NextFunction) => {
  let {fileId} = req.query
  fileId = fileId as string
  if (!(fs.existsSync(getBlobpath(fileId)))) {
    res.status(400).send({error: "No blob found."})
  }
  const blobStats = fs.statSync(getBlobpath(fileId))
  res.status(200).json({
    totalBytesUploaded: blobStats.size
  })
}