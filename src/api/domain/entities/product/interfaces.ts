import {
  IGeneralEntityProperties
} from '../../interfaces/index'

export interface IProductBlobProperties {
  originalFilepath: string
  blobURL: string
}
export interface IProductBlob {
  contentZip: IProductBlobProperties // content URL of the product,
  previewVideo: IProductBlobProperties // preview clip URL,
  previewImage: IProductBlobProperties // preview image of the product,
}
export interface IProductParams {
  name: string // some internal name
  title: string // title of the scene
  description: string // description of the scene
}
export interface IProdutBody extends IProductParams {
  published: boolean // toggle if it will show it portal or not.
  discountPercentage: number // discount of the scene/product
  price: number // price of the scene. float
}
export interface IProductEntity extends IProdutBody, IProductBlob, IGeneralEntityProperties {
  adminAccountId: string // admin account who added the product
  purchaseCount: number // number of times this product purchased.
}