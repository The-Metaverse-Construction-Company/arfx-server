/**
 * @libraries
 */
import {Strategy as JwtStrategy, ExtractJwt} from 'passport-jwt';
import {OIDCStrategy, BearerStrategy} from 'passport-azure-ad'
import {Request} from 'express'
import {
  ADMIN_JWT_ACCESS_TOKEN_SECRET,
  JWT_ACCESS_TOKEN_SECRET
} from '../api/utils/constants'
// import User from '../api/models/user.model';
/**
 * @services
 */
import {
  userVerifyToken
} from '../api/service-configurations/users'
import {
  adminAccountVerifyAuthTokenService
} from '../api/service-configurations/admin-accounts'
import { TOKEN_TYPE } from '../api/utils/constants';
import RedisClient from './redis'
import { ADMIN_ACCOUNT_TOKEN_TYPES } from '../api/domain/entities/admin-accounts';
import AzureADOpt from '../config/azure-ad'
const jwtOptions = {
  secretOrKey: JWT_ACCESS_TOKEN_SECRET,
  jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('Bearer'),
  passReqToCallback: true
};
const adminJWTOptions = {
  secretOrKey: ADMIN_JWT_ACCESS_TOKEN_SECRET,
  jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('Bearer'),
  passReqToCallback: true
};
// const AADPassportOptions = {
//   secretOrKey: ADMIN_JWT_ACCESS_TOKEN_SECRET,
//   jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('Bearer'),
//   passReqToCallback: true
// };

const JWTAuthHandler = async (req: Request, payload: any, done: any = () => null) => {
  try {
    const {authorization = ''} = req.headers
    const accessToken = authorization.split(' ')[1]
    const user = await userVerifyToken(RedisClient)
      .verifyOne(accessToken, TOKEN_TYPE.SIGN_IN)
    if (user) return done(null, JSON.parse(JSON.stringify({...user, isAdmin: false})));
    return done(null, false);
  } catch (error) {
    return done(error, false);
  }
};
const AdminAccountAuthHandler = async (req: Request, payload: any, done: any = () => null) => {
  try {
    const {authorization = ''} = req.headers
    const accessToken = authorization.split(' ')[1]
    const adminAccount = await adminAccountVerifyAuthTokenService(RedisClient)
      .verifyOne(accessToken, ADMIN_ACCOUNT_TOKEN_TYPES.SIGN_IN)
    if (adminAccount) return done(null, JSON.parse(JSON.stringify({...adminAccount, isAdmin: true})));
    return done(null, false);
  } catch (error) {
    console.log('error :>> ', error);
    return done(error, false);
  }
};
const azureADAuthHandler = async (req: Request, payload: any, done: any = () => null) => {

  console.log('object :>> xxxxxxxxxxxx', req);
  console.log('object :>> ', payload);
  done(null)
  // try {
  //   const {authorization = ''} = req.headers
  //   const accessToken = authorization.split(' ')[1]
  //   const adminAccount = await adminAccountVerifyAuthTokenService(RedisClient)
  //     .verifyOne(accessToken, ADMIN_ACCOUNT_TOKEN_TYPES.SIGN_IN)
  //   if (adminAccount) return done(null, JSON.parse(JSON.stringify({...adminAccount, isAdmin: true})));
  //   return done(null, false);
  // } catch (error) {
  //   console.log('error :>> ', error);
  //   return done(error, false);
  // }
};

// const oAuth = (service: string) => async (token: string, done: any = () => null) => {
//   try {
//     //@ts-expect-error
//     const userData = await authProviders[service](token);
//     //@ts-expect-error
//     const user = await User.oAuthLogin(userData);
//     return done(null, user);
//   } catch (err) {
//     return done(err);
//   }
// };
export const jwt = new JwtStrategy(jwtOptions, JWTAuthHandler);
export const adminAuthJWT = new JwtStrategy(adminJWTOptions, AdminAccountAuthHandler);
export const AzureADAuthJWT = new BearerStrategy({
  // identityMetadata: 'https://login.microsoftonline.com/shawmakesmagicgmail.onmicrosoft.com/oauth2/token', 
  identityMetadata: 'https://login.microsoftonline.com/shawmakesmagicgmail.onmicrosoft.com/v2.0/.well-known/openid-configuration', 
  // identityMetadata: 'https://login.microsoftonline.com/shawmakesmagicgmail.onmicrosoft.com/oauth2/authorize', 
  clientID: '96d26178-9443-46ee-b43f-8e1ae3c6cd6a',
  validateIssuer: false,
  isB2C: false,
  audience: '96d26178-9443-46ee-b43f-8e1ae3c6cd6a',
  // issuer: '96d26178-9443-46ee-b43f-8e1ae3c6cd6a',
  passReqToCallback: false,
  // useCookieInsteadOfSession: true,
  scope: ['user.read'],
  // scope: ['mail.read', 'offline_access', 'openid', 'profile'],
  loggingLevel: 'info'
}, azureADAuthHandler);
// export const facebook = new BearerStrategy(oAuth('facebook'));
// export const google = new BearerStrategy(oAuth('google'));
