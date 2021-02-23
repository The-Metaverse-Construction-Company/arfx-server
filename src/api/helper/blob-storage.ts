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
  upload: (blobName: string, file: string, blobContainerName: string, callback = (url: string) => {}) => {
    return new Promise(async (resolve, reject) => {
      try {
        let blobLoc = file
        const bbc = new BlockBlobClient(AZURE_CONNECTION_STRING, blobContainerName, blobName)
        // check env first, if env is only development, then save it only on the static folder.
        // if the env production is production, upload it thru cloud storage provider.
        try {
          if (NODE_ENV === 'production') {
            // uploading the file thru cloud
            // upload the file and run it thru background.
            const fileReadStream = fs.createReadStream(file)
            bbc
              .uploadStream(fileReadStream, ((1024 * 1024) * 8), 5)
              .catch((err) => {
                throw err
              })
              .finally(() => {
                callback(bbc.url)
                console.log('Removing blob file.');
                fs.unlinkSync(file)
              })
            blobLoc = bbc.url
          } else {
            callback(blobLoc)
          }
          resolve(blobLoc)
        } catch (error) {
          console.log('failed to upload. Error: ', error);
          throw error
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
    console.log('fetching blob buffer...');
    const blobBuffer = await bbc.downloadToBuffer()
    console.log('fetched blob buffer.');
    return blobBuffer
  }
}

export default blobStorage