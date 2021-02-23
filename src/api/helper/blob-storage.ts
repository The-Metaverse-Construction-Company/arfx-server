import fs from 'fs'
import { 
  BlobServiceClient,
  BlockBlobClient,
  generateBlobSASQueryParameters,
  BlobSASPermissions,
  StorageSharedKeyCredential 
} from '@azure/storage-blob';
import { AZURE_BLOB_SAS_URL,
  AZURE_CONNECTION_STRING,
  AZURE_BLOB_CONTAINER_NAME,
  NODE_ENV,
  AZURE_BLOB_KEY,
  AZURE_ACCOUNT_NAME
} from '../utils/constants';
const containerName = AZURE_BLOB_CONTAINER_NAME;
const blobServiceClient = new BlobServiceClient(AZURE_BLOB_SAS_URL);
// const SASQueryParams = generateBlobSASQueryParameters({
//   containerName: 'private-blob',
//   permissions: BlobSASPermissions.parse('r'),
//   startsOn: new Date((Date.now() - ((60 * 1000) * 10))), // 10 minutes,
//   expiresOn: new Date((Date.now() + ((60 * 1000) * 10))) // 10 minutes,
// }, new StorageSharedKeyCredential(AZURE_ACCOUNT_NAME, AZURE_BLOB_KEY))
const blobStorage = {
  upload: (blobName: string, file: string, blobContainerName: string, async: boolean = false) => {
    return new Promise(async (resolve, reject) => {
      try {
        let blobLoc = file
        const bbc = new BlockBlobClient(AZURE_CONNECTION_STRING, blobContainerName, blobName)
        // check env first, if env is only development, then save it only on the static folder.
        // if the env production is production, upload it thru cloud storage provider.
        try {
          // if (NODE_ENV === 'production') {
          // uploading the file thru cloud
          // upload the file and run it thru background.
          if (async) {
            await bbc.uploadFile(file)
          } else {
            bbc.uploadFile(file)
          }
          // wait the response and get the bbc url.
          blobLoc = bbc.url
          resolve(blobLoc)
        // }
        } catch (error) {
          console.log('failed to upload. Error: ', error);
        }
        return
      } catch (error) {
        reject(error)
      }
    })
  },
  download: async (containerName: string, blobName: string) => {
    const bbc = new BlockBlobClient(AZURE_CONNECTION_STRING, containerName, blobName)
    // Get blob content from position 0 to the end
    // In browsers, get downloaded data by accessing downloadBlockBlobResponse.blobBody
    const blobBuffer = await bbc.downloadToBuffer()
    // const b64 = blobBuffer.toString('base64')
    return blobBuffer
  }
}

export default blobStorage