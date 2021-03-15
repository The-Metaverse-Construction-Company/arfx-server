const AZURE_COSMOS_CONFIG = {
  accountName: process.env.AZURE_COSMOS_ACCOUNT_NAME || '',
  databaseName: process.env.AZURE_COSMOS_DATABASE_NAME || 'arfxhome-dev',
  key: process.env.AZURE_COSMOS_KEY || '',
  port: process.env.AZURE_COSMOS_DATABASE_PORT || 10255
}
console.log('AZURxxxE_COSMOS_CONFIG :>> ', AZURE_COSMOS_CONFIG);
export default AZURE_COSMOS_CONFIG