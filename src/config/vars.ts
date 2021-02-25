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
      return `mongodb://${AZURE_COSMOS_CONFIG.accountName}:${AZURE_COSMOS_CONFIG.key}@${AZURE_COSMOS_CONFIG.accountName}.mongo.cosmos.azure.com:${AZURE_COSMOS_CONFIG.port}/arfxhome-test?ssl=true&appName=@${AZURE_COSMOS_CONFIG.accountName}@`
    // case NODE_ENVIRONMENTS.PRODUCTION:
    //   // return `mongodb://${AZURE_COSMOS_CONFIG.accountName}:${AZURE_COSMOS_CONFIG.key}@${AZURE_COSMOS_CONFIG.accountName}.mongo.cosmos.azure.com:${AZURE_COSMOS_CONFIG.port}/${AZURE_COSMOS_CONFIG.databaseName}?ssl=true`
    //   return `mongodb://${AZURE_COSMOS_CONFIG.accountName}:${AZURE_COSMOS_CONFIG.key}@${AZURE_COSMOS_CONFIG.accountName}.documents.azure.com:${AZURE_COSMOS_CONFIG.port}/${AZURE_COSMOS_CONFIG.databaseName}?ssl=true`
    default:
      return `mongodb://${AZURE_COSMOS_CONFIG.accountName}:${AZURE_COSMOS_CONFIG.key}@${AZURE_COSMOS_CONFIG.accountName}.mongo.cosmos.azure.com:${AZURE_COSMOS_CONFIG.port}/${AZURE_COSMOS_CONFIG.databaseName}?ssl=true&appName=@${AZURE_COSMOS_CONFIG.accountName}@`
      // return process.env.MONGO_URI
  }
}
export const env = process.env.NODE_ENV || ''
export const port =  process.env.PORT || ''
export const jwtSecret =  process.env.JWT_SECRET || ''
export const jwtExpirationInterval =  process.env.JWT_EXPIRATION_MINUTES ? parseInt(process.env.JWT_EXPIRATION_MINUTES) : 60
export const mongo =  {
  uri: getMongoDBURI(env)
}
export const AZURE_COSMOS_KEY = process.env.AZURE_COSMOS_KEY || ''
export const logs = process.env.NODE_ENV === 'production' ? 'combined' : 'dev'
export const emailConfig = {
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  username: process.env.EMAIL_USERNAME,
  password: process.env.EMAIL_PASSWORD,
}