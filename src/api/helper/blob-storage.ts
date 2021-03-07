import fs from 'fs'
import { 
  BlockBlobClient,
  generateBlobSASQueryParameters,
  BlobSASPermissions,
  StorageSharedKeyCredential 
} from '@azure/storage-blob';
import {
  AZURE_CONNECTION_STRING,
  NODE_ENV,
  AZURE_BLOB_KEY,
  AZURE_ACCOUNT_NAME
} from '../../config/vars';
import {
  NODE_ENVIRONMENTS
} from '../utils/constants';
const blobStorage = {
  upload: (blobName: string, file: File, blobContainerName: string, callback = (url: string) => {}): Promise<string> => {
    return new Promise(async (resolve, reject) => {
      try {
        //@ts-expect-error
        let {path:blobLoc = '', mimetype = '', originalname = '', fieldname = ''} = file
        const bbc = new BlockBlobClient(AZURE_CONNECTION_STRING, blobContainerName, blobName)
        // check env first, if env is only development, then save it only on the static folder.
        // if the env production is production, upload it thru cloud storage provider.
        try {
          // if ((NODE_ENV === NODE_ENVIRONMENTS.PRODUCTION)) {
            // uploading the file thru cloud
            // upload the file and run it thru background.
            const fileReadStream = fs.createReadStream(blobLoc)
            bbc
              .uploadStream(fileReadStream, ((1024 * 1024) * 8), 5, {
                blobHTTPHeaders: {
                  blobContentType: mimetype
                  // blobContentDisposition: `form-data; name="${fieldname}"; filename="${originalname}"`
                }
              })
              .catch((err) => {
                console.log('Failed to upload blob.', err.message);
                // throw err
              })
              .finally(() => {
                callback(bbc.url)
                resolve(bbc.url)
              })
            blobLoc = bbc.url
          // } else {
          //   callback(blobLoc)
          //   resolve(blobLoc)
          // }
          // resolve(blobLoc)
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
  },
  generateSASToken: (contanerName: string, blobName: string) => {
    return generateBlobSASQueryParameters({
        containerName: contanerName,
        blobName,
        permissions: BlobSASPermissions.parse('r'),
        startsOn: new Date((Date.now() - ((60 * 1000) * 10))), // 10 minutes,
        expiresOn: new Date((Date.now() + ((60 * 1000) * 50))) // 50 minutes,
      }, new StorageSharedKeyCredential(AZURE_ACCOUNT_NAME, AZURE_BLOB_KEY))
        .toString()
  }
}

export default blobStorage