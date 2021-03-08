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
  AZURE_AD_ACCOUNT_NAME,
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
 * @services
 */
import {
  createAdminAccountService,
  adminAccountDetailsService
} from '../api/service-configurations/admin-accounts'
/**
 * @app_entities
 */
import { ALLOWED_USER_ROLE } from '../api/domain/entities/users';
import { ADMIN_ACCOUNT_TOKEN_TYPES, ADMIN_ROLE_LEVEL } from '../api/domain/entities/admin-accounts';
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
    const user = await userDetails()
      .findByAzureAdUserId(data.oid)
      .catch(async (err) => {
        console.log('data :>> ', data);
        if (err.message === 'No data found.') {
          const email = data.preferred_username ?? (data.emails && data.emails.length >= 1) ? data.emails[0] : ''
          if (!email) {
            throw new Error('No primary email found.')
          }
          const fullName = data.name && data.name !== 'unknown' ? data.name : `${data.given_name} ${data.family_name}`
          const newUser = await createUserService()
            .createOne({
              name: fullName,
              email: email,
              mobileNumber: '',
              password: '',
              azureAdUserId: data.oid,
              role: ALLOWED_USER_ROLE.USER
            })
            // set the account from azure ad verified.
          const user  = await verifyUserService()
            .verifyOne(newUser._id)
          return user
        }
      })
    done(null, user)
    return
  } catch (error) {
    console.log('error :>> ', error);
    done(error, null, {})
  }
};
const azureADAdminAuthHandler = async (req: any, data: any, done: any = () => null) => {
  try {
    const accessToken = req.headers['authorization'].split(' ')[1]
    if (!data.oid) {
      throw new Error('No admin user auth found.')
    }
    const adminAccount = await adminAccountDetailsService()
      .getOneByAzureAdId(data.oid)
      .catch(async (err) => {
        if (err.message === 'No admin account found.') {
          console.log('data :>> ', data);
          const email = data.preferred_username || ((data.emails && data.emails.length >= 1) ? data.emails[0] : '')
          console.log('email :>> ', email);
          if (!email) {
            throw new Error('No primary email found.')
          }
          const {admin} = await createAdminAccountService()
            .createOne({
              firstName: `ARFXHome`,
              lastName: `Admin`,
              roleLevel: ADMIN_ROLE_LEVEL.ADMIN,
              email: email,
              password: 'qweQWE123!@#', // default pwd
              azureAdId: data.oid,
            })
            console.log('admin :>> ', admin);
          return admin
        }
        throw err
      })
    if (!adminAccount) {
      throw new Error('No admin account found.')
    }
    return done(null, JSON.parse(JSON.stringify({...adminAccount, isAdmin: true})));
  } catch (error) {
    console.log('err@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@2or :>> ', error);
    done(error, null, {})
  }
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
export const AzureADAdminAuthJWT = new BearerStrategy({
  // identityMetadata: `https://${AZURE_AD_ACCOUNT_NAME}.microsoftonline.com/ed3b5426-dadf-4250-bc15-9e6aefe47fd6.onmicrosoft.com/v2.0/.well-known/openid-configuration`, 
  // identityMetadata: 'https://login.microsoftonline.com/shawmakesmagicgmail.onmicrosoft.com/oauth2/token', 
  // identityMetadata: 'https://login.microsoftonline.com/shawmakesmagicgmail.onmicrosoft.com/oauth2/v2.0/authorize', 
  identityMetadata: "https://login.microsoftonline.com/ed3b5426-dadf-4250-bc15-9e6aefe47fd6/v2.0/.well-known/openid-configuration",
  // identityMetadata: `https://${AZURE_AD_ACCOUNT_NAME}.b2clogin.com/${AZURE_AD_ACCOUNT_NAME}.onmicrosoft.com/B2C_1_SIGN_UP_SIGN_IN1/v2.0/.well-known/openid-configuration`, 
  clientID: `ceea412b-1a99-4a30-b0a2-d857209d8169`,
  // clientSecret: `3cc11fa8-efd3-4e8c-8920-d7738c595190`,
  validateIssuer: false,
  // isB2C: true,
  // policyName: 'B2C_1_SIGN_UP_SIGN_IN1',
  passReqToCallback: true,
  audience: `ceea412b-1a99-4a30-b0a2-d857209d8169`,
  scope: [
    'User.Read',
    'profile',
    'openid',
    'dev.read'
  ],
  // scope: ['dev.read'],
  loggingLevel: 'info',
  loggingNoPII: false,
}, azureADAdminAuthHandler);
// export const facebook = new BearerStrategy(oAuth('facebook'));
// export const google = new BearerStrategy(oAuth('google'));
