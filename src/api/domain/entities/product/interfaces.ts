import {
  IGeneralEntityProperties
} from '../../interfaces/index'

export interface IProductBlobProperties {
  originalFilepath: string
  blobURL: string
}
export interface IProductContentZip extends IProductBlobProperties{
  version: number // version of the product. will increase this every time product is updated.
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
  adminAccountId: string // admin account who added the product
  purchaseCount: number // number of times this product purchased.
}