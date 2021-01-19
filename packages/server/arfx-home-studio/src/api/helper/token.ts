import jwt from "jsonwebtoken"
import { env, jwtSecret, jwtExpirationInterval } from '../../config/vars'
/**
 * @services
 */

export const generateToken = (payload: any) => {
  return jwt.sign({
    ...payload,
    exp: Date.now() * (jwtExpirationInterval * 1000),
    iat: Date.now(),
  }, jwtSecret)
}
export  const verifyToken = (token: string) => {
  return jwt.verify(token, jwtSecret)
}