import { BlobServiceClient, BlockBlobClient } from '@azure/storage-blob';
import fs from 'fs'
import { AZURE_BLOB_SAS_URL, AZURE_CONNECTION_STRING, AZURE_BLOB_CONTAINER_NAME, NODE_ENV, BACKEND_HOST } from '../utils/constants';
const containerName = AZURE_BLOB_CONTAINER_NAME;
const blobServiceClient = new BlobServiceClient(AZURE_BLOB_SAS_URL);
const blobStorage = {
  upload: (blobName: string, file: string) => {
    return new Promise(async (resolve, reject) => {
      try {
        let blobLoc = file
        const bbc = new BlockBlobClient(AZURE_CONNECTION_STRING, containerName, blobName)
        // check env first, if env is only development, then save it only on the static folder.
        // if the env production is production, upload it thru cloud storage provider.
        if (NODE_ENV === 'production') {
          // uploading the file thru cloud
          // upload the file and run it thru background.
          const uploadBlobResponse = bbc.uploadFile(file)
          // wait the response and get the bbc url.
          blobLoc = bbc.url
        }
        resolve(blobLoc)
        return
      } catch (error) {
        reject(error)
      }
    })
  },
  download: async (blobName: string) => {
    const containerClient = blobServiceClient.getContainerClient(containerName);
    const blobClient = containerClient.getBlobClient(blobName);
  
    // Get blob content from position 0 to the end
    // In browsers, get downloaded data by accessing downloadBlockBlobResponse.blobBody
    const downloadBlockBlobResponse = await blobClient.download();
    const downloaded = (URL).createObjectURL(await downloadBlockBlobResponse.blobBody);
    // console.log("Downxxxxxxxxxxxxxxxxxxxxxloaded blob content", );
    // [Browsers only] A helper method used to convert a browser Blob into string.
    // async function blobToString(blob) {
    //   const fileReader = new FileReader();
    //   return new Promise((resolve, reject) => {
    //     fileReader.onloadend = (ev) => {
    //       resolve(ev.target.result);
    //     };
    //     fileReader.onerror = reject;
    //     fileReader.readAsDataURL(blob);
    //   });
    // }
    return downloaded
  }
}

export default blobStorage