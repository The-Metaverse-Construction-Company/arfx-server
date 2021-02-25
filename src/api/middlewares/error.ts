import {
  NextFunction,
Request, Response
} from 'express'
import httpStatus from 'http-status'
import APIError from '../utils/APIError'
import { env } from '../../config/vars'

/**
 * Error handler. Send stacktrace only during development
 * @public
 */
const requestHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  const response = {
    code: err.httpStatus ?? err.status,
    message: err.message || httpStatus[err.status],
    errors: err.errors,
    stack: err.stack,
  };
  if (env !== 'development') {
    delete response.stack;
  }
  res.status(err.status);
  res.json(response);
};
export const handler = requestHandler;
/**
 * If error is not an instanceOf APIError, convert it.
 * @public
 */
export const converter = (err: any, req: Request, res: Response, next: NextFunction) => {
  let convertedError = err;
  // if (err instanceof expressValidation.ValidationError) {
  //   convertedError = new APIError({
  //     message: 'Validation Error',
  //     errors: err.errors,
  //     status: err.status,
  //     //@ts-expect-error
  //     stack: err.stack,
  //   });
  // } else if (!(err instanceof APIError)) {
  //   convertedError = new APIError({
  //     message: err.message,
  //     status: err.status,
  //     stack: err.stack,
  //   });
  // }
  console.log('err :>> ', err);
  if (!(err instanceof APIError)) {
    res.status(err.httpStatus ?? httpStatus.BAD_REQUEST);
    res.json({
      success: false,
      errors: err.errors,
      result: null
    });
  } else {
    return requestHandler(convertedError, req, res, next);
  }
};

/**
 * Catch 404 and forward to error handler
 * @public
 */
export const notFound = (req: Request, res: Response, next: NextFunction) => {
  const err = new APIError({
    message: 'Not found',
    status: httpStatus.NOT_FOUND,
  });
  return requestHandler(err, req, res, next);
};
