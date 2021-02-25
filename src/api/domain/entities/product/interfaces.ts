import {
  IGeneralEntityProperties
} from '../../interfaces/index'
import { PRODUCT_STATES, PRODUCT_UPLOAD_BLOB_STATES } from './constants';

export interface IProductBlobProperties {
  originalFilepath: string
  blobURL: string
  state: PRODUCT_UPLOAD_BLOB_STATES
}
export interface IProductContentZip extends IProductBlobProperties{
  version: number // version of the product. will increase this every time product is updated.
  hash: string // hash of the content zip that will verify thru the client side. to validate if the content zip that they downloaded is matched thru this file hashed.
}
export interface IProductBlob {
  contentZip: IProductContentZip // contentzip of the product,
  previewVideo: IProductBlobProperties // preview clip URL,
  previewImage: IProductBlobProperties // preview image of the product,
  thumbnail: IProductBlobProperties // preview image of the product,
}
export interface IProductParams {
  name: string // some internal name
  title: string // title of the scene
  description: string // description of the scene
  discountPercentage: number // discount of the scene/product
  price: number // price of the scene. float
}
export interface IProdutBody extends IProductParams, IProductBlob {
}
export interface IProductEntity extends IProdutBody, IGeneralEntityProperties {
  published: boolean // toggle if it will show it portal or not.
  state: PRODUCT_STATES
  adminAccountId: string // admin account who added the product
  purchaseCount: number // number of times this product purchased.
}