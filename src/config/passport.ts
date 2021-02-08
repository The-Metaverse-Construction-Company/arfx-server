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
  userVerifyToken,
  verifyUserService,
  createUserService,
  userDetails
} from '../api/service-configurations/users'
import {
  adminAccountVerifyAuthTokenService
} from '../api/service-configurations/admin-accounts'
import { TOKEN_TYPE } from '../api/utils/constants';
import RedisClient from './redis'
import { ADMIN_ACCOUNT_TOKEN_TYPES } from '../api/domain/entities/admin-accounts';
import AzureADOpt from '../config/azure-ad'
import { ALLOWED_USER_ROLE } from '../api/domain/entities/users';
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
const azureADAuthHandler = async (req: any, done: any = () => null) => {

  try {
    const user = await userDetails()
      .findByAzureAdUserId(req.oid)
      .catch(async (err) => {
        if (err.message === 'No data found.') {
          const newUser = await createUserService()
            .createOne({
              name: req.name,
              email: req.preferred_username,
              mobileNumber: '',
              password: '',
              azureAdUserId: req.oid,
              role: ALLOWED_USER_ROLE.USER
            })
          const user  = await verifyUserService().verifyOne(newUser._id)
          return user
        }
      })
    done(null, user)
    return
  } catch (error) {
    done(error, null, {})
  }
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
  identityMetadata: 'https://login.microsoftonline.com/shawmakesmagicgmail.onmicrosoft.com/v2.0/.well-known/openid-configuration', 
  clientID: '315c2870-ce96-4824-8512-d608b99b20dd',
  audience: '315c2870-ce96-4824-8512-d608b99b20dd',
  validateIssuer: true,
  passReqToCallback: false,
  scope: ['access_as_user'],
  // scope: ['mail.read', 'offline_access', 'openid', 'profile'],
  loggingNoPII: false,
  loggingLevel: 'info'
}, azureADAuthHandler);
// export const facebook = new BearerStrategy(oAuth('facebook'));
// export const google = new BearerStrategy(oAuth('google'));
