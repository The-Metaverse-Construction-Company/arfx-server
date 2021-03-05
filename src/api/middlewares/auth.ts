import httpStatus from 'http-status'
import passport from 'passport'
import APIError from '../utils/APIError'
import {
  Request, Response, NextFunction
} from 'express'
import { ALLOWED_USER_ROLE, ALLOWED_USER_ROLES } from '../domain/entities/users';
export const ADMIN = 'admin';
export const LOGGED_USER = '_loggedUser';

const handleJWT = (req: Request, res: Response, next: NextFunction, roles: any) => async (err: any, user: any, info: any) => {
  const error = err || info;
  //@ts-expect-error
  const logIn = Promise.promisify(req.logIn);
  const apiError = new APIError({
    message: error ? error.message : 'Unauthorized',
    status: httpStatus.UNAUTHORIZED,
    stack: error ? error.stack : undefined,
  });
  try {
    if (error || !user) throw error;
    await logIn(user, { session: false });
  } catch (e) {
    return next(apiError);
  }
  if (user.isAdmin) {
    if (roles && !roles.includes(ALLOWED_USER_ROLE.ADMIN)) {
      // unable to sign in. invalid user role.
      apiError.status = httpStatus.FORBIDDEN;
      apiError.message = 'Forbidden';
      return next(apiError);
    }
  } else {
    if (user.role === ALLOWED_USER_ROLE.USER) {
      if (req.params.userId && req.params.userId !== user._id.toString()) {
        apiError.status = httpStatus.FORBIDDEN;
        apiError.message = 'Forbidden';
        return next(apiError);
      }
    } else if (!roles.includes(user.role)) {
      apiError.status = httpStatus.FORBIDDEN;
      apiError.message = 'Forbidden';
      return next(apiError);
    } else if (err || !user) {
      return next(apiError);
    }
  }
  req.user = user;
  next();
  return;
};

export const authorize = (roles: string|string[] = ALLOWED_USER_ROLES) => (req: Request, res: Response, next: NextFunction) =>
  passport.authenticate(
    // ['admin-auth'], { session: false },
    ['admin-auth', 'jwt', 'azure-oauth-bearer'], { session: false },
    handleJWT(req, res, next, roles),
  )(req, res, next);
export const authorizeAdminAccount = () => (req: Request, res: Response, next: NextFunction) =>
  passport.authenticate(
    // ['admin-auth'], { session: false },
    ['admin-auth'], { session: false },
    handleJWT(req, res, next, ALLOWED_USER_ROLE.ADMIN),
  )(req, res, next);
export const authAzureAD = () => (req: Request, res: Response, next: NextFunction) =>
  passport.authenticate(
    ['azure-oauth-bearer'], { session: false },
    handleJWT(req, res, next, ALLOWED_USER_ROLES),
  )(req, res, next);

export const oAuth = (service: string) =>
  passport.authenticate(service, { session: false });
