import { NODE_ENVIRONMENTS } from '../api/utils/constants'
import AZURE_COSMOS_CONFIG from './azure-cosmos'
// import .env variables
// require('dotenv-safe').load({
//   path: path.join(__dirname, '../../.env.local'),
//   sample: path.join(__dirname, '../../.env.example'),
// });

const getMongoDBURI = (NODE_ENV: string) => {
  switch(NODE_ENV) {
    case NODE_ENVIRONMENTS.TEST:
      // return `mongodb://${AZURE_COSMOS_CONFIG.accountName}:${AZURE_COSMOS_CONFIG.key}@${AZURE_COSMOS_CONFIG.accountName}.mongo.cosmos.azure.com:${AZURE_COSMOS_CONFIG.port}/arfxhome-test?ssl=true&appName=@${AZURE_COSMOS_CONFIG.accountName}@`
      return process.env.MONGO_URI_TEST
    case NODE_ENVIRONMENTS.PRODUCTION:
      return `mongodb://${AZURE_COSMOS_CONFIG.accountName}:${AZURE_COSMOS_CONFIG.key}@${AZURE_COSMOS_CONFIG.accountName}.mongo.cosmos.azure.com:${AZURE_COSMOS_CONFIG.port}/${AZURE_COSMOS_CONFIG.databaseName}?ssl=true&appName=@${AZURE_COSMOS_CONFIG.accountName}@`
    default:
      // return `mongodb://${AZURE_COSMOS_CONFIG.accountName}:${AZURE_COSMOS_CONFIG.key}@${AZURE_COSMOS_CONFIG.accountName}.mongo.cosmos.azure.com:${AZURE_COSMOS_CONFIG.port}/${AZURE_COSMOS_CONFIG.databaseName}?ssl=true&appName=@${AZURE_COSMOS_CONFIG.accountName}@`
      return process.env.MONGO_URI
  }
}
export const NODE_ENV = process.env.NODE_ENV || 'development'
export const port =  process.env.PORT || ''
export const jwtSecret =  process.env.JWT_SECRET || ''
export const jwtExpirationInterval =  process.env.JWT_EXPIRATION_MINUTES ? parseInt(process.env.JWT_EXPIRATION_MINUTES) : 60
export const mongo =  {
  uri: getMongoDBURI(NODE_ENV)
}
export const AZURE_COSMOS_KEY = process.env.AZURE_COSMOS_KEY || ''
export const logs = process.env.NODE_ENV === 'production' ? 'combined' : 'dev'
export const emailConfig = {
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  username: process.env.EMAIL_USERNAME,
  password: process.env.EMAIL_PASSWORD,
}
export const BACKEND_HOST = process.env.BACKEND_HOST || `http://localhost:3000`
// ENV VARIABLES
export const JWT_ACCESS_TOKEN_SECRET = process.env.JWT_ACCESS_TOKEN_SECRET || ''
export const JWT_ACCESS_TOKEN_DURATION_MINUTES = process.env.JWT_ACCESS_TOKEN_EXPIRATION_MINUTES ? parseInt(process.env.JWT_ACCESS_TOKEN_EXPIRATION_MINUTES) : 60
// refresh token
export const JWT_REFRESH_TOKEN_SECRET = process.env.JWT_REFRESH_TOKEN_SECRET || ''
export const JWT_REFRESH_TOKEN_DURATION_MINUTES = process.env.JWT_REFRESH_TOKEN_EXPIRATION_MINUTES ? (parseInt(process.env.JWT_REFRESH_TOKEN_EXPIRATION_MINUTES) * (24 * 60)) : (10 * (24 * 60))
// ADMIN ACCESS AND REFRESH TOKEN
export const ADMIN_JWT_ACCESS_TOKEN_SECRET = process.env.ADMIN_JWT_ACCESS_TOKEN_SECRET || ''
export const ADMIN_JWT_REFRESH_TOKEN_SECRET = process.env.ADMIN_JWT_REFRESH_TOKEN_SECRET || ''
// CLIENTS/FRONTEND //

export const CLIENT_HOST= process.env.CLIENT_HOST || `http://localhost:3001`

/// STRIPE KEYS ////
export const STRIPE_SECRET_KEY = NODE_ENV === NODE_ENVIRONMENTS.PRODUCTION ? (process.env.STRIPE_SECRET_KEY || '') : (process.env.STRIPE_SECRET_KEY_DEV || '')
export const STRIPE_PUBLIC_KEY = NODE_ENV === NODE_ENVIRONMENTS.PRODUCTION ? (process.env.STRIPE_PUBLIC_KEY || '') : (process.env.STRIPE_PUBLIC_KEY_DEV || '')
export const STRIPE_WH_SECRET = process.env.STRIPE_WH_SECRET || ''
/// SENDGRID
export const SENDGRID_SECRET_KEY = process.env.SENDGRID_SECRET_KEY || ''

// AZURE BLOB CONFIGS ///
export const AZURE_CONNSTRING = process.env.AZURE_CONNSTRING || ''
export const AZURE_CONNECTION_STRING = process.env.AZURE_CONNECTION_STRING || ''
export const AZURE_BLOB_SAS_TOKEN = process.env.AZURE_BLOB_SAS_TOKEN || ''
export const AZURE_BLOB_SAS_URL = process.env.AZURE_BLOB_SAS_URL || ''
export const AZURE_BLOB_KEY = process.env.AZURE_BLOB_KEY || ''
export const AZURE_ACCOUNT_NAME = process.env.AZURE_ACCOUNT_NAME || ''
export const AZURE_BLOB_CONTAINER_NAME = {
  PRIVATE_BLOB: 'private-blob',
  PUBLIC_BLOB: 'public-blob',
}
// ## AZURE AD CONFIG ##
export const AZURE_AD_ACCOUNT_NAME = process.env.AZURE_AD_ACCOUNT_NAME || ''
export const AZURE_AD_TENANT_ID = process.env.AZURE_AD_TENANT_ID || ''
// ## AZURE AD USER CONFIG ###
export const AZURE_AD_CLIENT_ID = process.env.AZURE_AD_CLIENT_ID || ''
export const AZURE_AD_CLIENT_SECRET_ID = process.env.AZURE_AD_CLIENT_SECRET_ID || ''
export const AZURE_AD_CLIENT_SCOPES = process.env.AZURE_AD_CLIENT_SCOPES ? process.env.AZURE_AD_CLIENT_SCOPES.split(' ') : ['openid', 'offline_access']
// ## AZURE AD ADMIN CONFIG ###
export const AZURE_AD_ADMIN_CLIENT_ID = process.env.AZURE_AD_ADMIN_CLIENT_ID || ''
export const AZURE_AD_ADMIN_CLIENT_SECRET_ID = process.env.AZURE_AD_ADMIN_CLIENT_SECRET_ID || ''
export const AZURE_AD_ADMIN_CLIENT_SECRET_VALUE = process.env.AZURE_AD_ADMIN_CLIENT_SECRET_VALUE || ''
export const AZURE_AD_ADMIN_SCOPES = process.env.AZURE_AD_ADMIN_SCOPES ? process.env.AZURE_AD_ADMIN_SCOPES.split(' ') : ['User.Read', 'profile', 'openid','full']