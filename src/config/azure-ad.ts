
import {IBearerStrategyOption, IOIDCStrategyOption, VerifyOIDCFunction} from 'passport-azure-ad'
const tenantId = process.env.AZURE_AD_TENAND_ID || ''
const clientId = process.env.AZURE_AD_TENAND_ID || ''
const q = <IBearerStrategyOption> {
  // identityMetadata: 'https://login.microsoftonline.com/shawmakesmagicgmail.onmicrosoft.com/v2.0/.well-known/openid-configuration', 
  // identityMetadata: 'https://login.microsoftonline.com/shawmakesmagicgmail.onmicrosoft.com/oauth2/token', 
  // identityMetadata: 'https://login.microsoftonline.com/shawmakesmagicgmail.onmicrosoft.com/oauth2/v2.0/authorize', 
  identityMetadata: 'https://login.microsoftonline.com/shawmakesmagicgmail.onmicrosoft.com/oauth2/authorize', 
  clientID: 'fb576b86-5743-4354-b236-d2766629735e',
  clientSecret: 'c9f3a616-6a05-42aa-9358-30036ec583ea', 
  // responseType: 'code', 
  // responseMode: 'form_post', 
  // redirectUrl: 'http://localhost:3000/v1/auth', 
  // allowHttpForRedirectUrl: true,
  validateIssuer: false,
  isB2C: false,
  passReqToCallback: true,
  audience: 'fb576b86-5743-4354-b236-d2766629735e',
  // useCookieInsteadOfSession: true,
  scope: ['user.read'],
  loggingLevel: 'info'
}
export default q