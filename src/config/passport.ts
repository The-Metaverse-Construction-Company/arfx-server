/**
 * @libraries
 */
import {
  Strategy as JwtStrategy,
  ExtractJwt
} from 'passport-jwt';
import {
  BearerStrategy,
} from 'passport-azure-ad'
import {Request} from 'express'
/**
 * @env_variables
 */
import {
  ADMIN_JWT_ACCESS_TOKEN_SECRET,
  JWT_ACCESS_TOKEN_SECRET
} from '../config/vars'
/**
 * @services
 */
import {
  userVerifyToken,
  verifyUserService,
  createUserService,
  userDetails
} from '../api/service-configurations/users'
/**
 * @app_entities
 */
import { ALLOWED_USER_ROLE } from '../api/domain/entities/users';
import { ADMIN_ACCOUNT_TOKEN_TYPES } from '../api/domain/entities/admin-accounts';
import {
  adminAccountVerifyAuthTokenService
} from '../api/service-configurations/admin-accounts'
/**
 * @constant
 */
import { TOKEN_TYPE } from '../api/utils/constants';
/**
 * @config_variable
 */
import AzureADConfig  from '../config/azure-ad'
import RedisClient from './redis'


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
const azureADAuthHandler = async (req: any, data: any, done: any = () => null) => {
  try {
    const accessToken = req.headers['authorization'].split(' ')[1]
    if (!data.oid) {
      throw new Error('No user auth found.')
    }
    console.log('accessToken :>> ', accessToken);
    console.log('rexxxq :>> ', data);
    console.log('donxxxe :>> ', done);
    const user = await userDetails()
      .findByAzureAdUserId(req.oid)
      .catch(async (err) => {
        if (err.message === 'No data found.') {
          const email = req.preferred_username ?? req.emails.length >= 1 ? req.emails[0] : ''
          const fullName = req.name ?? `${req.given_name} ${req.family_name}` 
          const newUser = await createUserService()
            .createOne({
              name: fullName,
              email: email,
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
    console.log('error :>> ', error);
    // done(error, null, {})
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
export const AzureADAuthJWT = new BearerStrategy(AzureADConfig, azureADAuthHandler);
// export const facebook = new BearerStrategy(oAuth('facebook'));
// export const google = new BearerStrategy(oAuth('google'));
