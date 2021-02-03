import httpStatus from 'http-status'
import fs from 'fs'
import {
  Response, Request, NextFunction
} from 'express'
import { successReponse } from '../helper/http-response';
/**
 * @public
 * Returns jwt token if registration was successful
 */
export const ReleasedElectronVersionRoute = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const releasedVersion = fs.readFileSync(`${__dirname}/../../../electron-released-version`, 'utf-8')
    res.status(httpStatus.OK)
      .json(successReponse(releasedVersion))
  } catch (error) {
    next(error)
  }
};