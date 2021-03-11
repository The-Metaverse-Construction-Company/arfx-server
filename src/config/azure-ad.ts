/**
 * @libaries
 */
import {
  IBearerStrategyOption
} from 'passport-azure-ad'
/**
 * constants variables
 */
import { 
  AZURE_AD_ACCOUNT_NAME,
  AZURE_AD_CLIENT_ID,
  AZURE_AD_CLIENT_SCOPES,
  AZURE_AD_CLIENT_SECRET_ID
} from '../config/vars'
const AZURE_AD_CONFIG = <IBearerStrategyOption> {
  // identityMetadata: 'https://login.microsoftonline.com/shawmakesmagicgmail.onmicrosoft.com/v2.0/.well-known/openid-configuration', 
  // identityMetadata: 'https://login.microsoftonline.com/shawmakesmagicgmail.onmicrosoft.com/oauth2/token', 
  // identityMetadata: 'https://login.microsoftonline.com/shawmakesmagicgmail.onmicrosoft.com/oauth2/v2.0/authorize', 
  identityMetadata: `https://${AZURE_AD_ACCOUNT_NAME}.b2clogin.com/${AZURE_AD_ACCOUNT_NAME}.onmicrosoft.com/B2C_1_SIGN_UP_SIGN_IN1/v2.0/.well-known/openid-configuration`, 
  clientID: AZURE_AD_CLIENT_ID,
  clientSecret: AZURE_AD_CLIENT_SECRET_ID, 
  validateIssuer: false,
  isB2C: true,
  policyName: 'B2C_1_SIGN_UP_SIGN_IN1',
  passReqToCallback: true,
  audience: AZURE_AD_CLIENT_ID,
  scope: AZURE_AD_CLIENT_SCOPES,
  loggingLevel: 'info',
  loggingNoPII: false,
}
export default AZURE_AD_CONFIG