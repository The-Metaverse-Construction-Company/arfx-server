import { validationResult, query } from "express-validator"
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

export const PaginationQueryPipeline = [
  query('pageNo')
    .optional()
    .isInt({min: 0, max: 1000})
    .withMessage('pageNo must be a integer with mininum value of 0 and maximum value of 1000.'),
  query('limit')
    .isInt({min: 1, max: 100})
    .withMessage('limit must be a integer with mininum value of 0 and maximum value of 100.')
    .optional(),
  query('searchText')
    .isString()
    .withMessage('searchText must be a string.')
    .optional(),
]