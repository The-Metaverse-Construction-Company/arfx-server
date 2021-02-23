export const TOKEN_LABEL = {
  REFRESH: 'REFRESH_TOKEN',
  ACCESS: 'ACCESS_TOKEN'
}
export const TOKEN_TYPE = {
  SIGN_UP: 'SIGN_UP',
  SIGN_IN: 'SIGN_IN',
  RESET_PASSWORD: 'RESET_PASSWORD',
}
export const PAYMENT_GATEWAY_CHARGE_STATUSES = {
  SUCCEEDED: 'succeeded',
  FAILED: 'failed',
}
export const BACKEND_HOST = process.env.BACKEND_HOST || `http://localhost:3000`
export const NODE_ENV = process.env.NODE_ENV || 'development'
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
export const STRIPE_SECRET_KEY = NODE_ENV === 'production' ? (process.env.STRIPE_SECRET_KEY || '') : (process.env.STRIPE_SECRET_KEY_DEV || '')
export const STRIPE_PUBLIC_KEY = NODE_ENV === 'production' ? (process.env.STRIPE_PUBLIC_KEY || '') : (process.env.STRIPE_PUBLIC_KEY_DEV || '')
export const STRIPE_WH_SECRET = process.env.STRIPE_WH_SECRET || ''
/// SENDGRID
export const SENDGRID_SECRET_KEY = process.env.SENDGRID_SECRET_KEY || ''

// AZURE CONFIGS ///
export const AZURE_CONNSTRING = process.env.AZURE_CONNSTRING || ''
export const AZURE_CONNECTION_STRING = process.env.AZURE_CONNECTION_STRING || ''
export const AZURE_BLOB_SAS_TOKEN = process.env.AZURE_BLOB_SAS_TOKEN || ''
export const AZURE_BLOB_SAS_URL = process.env.AZURE_BLOB_SAS_URL || ''
export const AZURE_BLOB_CONTAINER_NAME = process.env.AZURE_BLOB_CONTAINER_NAME || ''
export const AZURE_BLOB_KEY = process.env.AZURE_BLOB_KEY || ''
export const AZURE_ACCOUNT_NAME = process.env.AZURE_ACCOUNT_NAME || ''
