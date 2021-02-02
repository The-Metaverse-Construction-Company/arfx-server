import { validationResult } from "express-validator"
import {NextFunction, Request, Response} from 'express'
import httpStatus from "http-status"
import { errorResponse } from "../helper/http-response"
export const requestValidatorMiddleware = (req: Request, res: Response, next: NextFunction) => {
  let result: any = validationResult(req)
  if (result.errors.length !== 0) {
    return res.status(httpStatus.BAD_REQUEST)
    .json(errorResponse(result.errors))
  }
  next()
}