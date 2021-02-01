import {
  IGeneralEntityProperties
} from '../../interfaces/index'

export interface IProductParams {
  name: string // some internal name
  title: string // title of the scene
  description: string // description of the scene
  contentURL: string // content URL of the product,
  previewVideoURL: string // preview clip URL,
  previewImageURL: string // preview image of the product,
}
export interface IProdutBody extends IProductParams {
  discountPercentage: number // discount of the scene/product
  price: number // price of the scene. float
  published: boolean // toggle if it will show it portal or not.
  adminAccountId: string // admin account who added the product
  purchaseCount: number // number of times this product purchased.
}

export type IProductEntity = IProdutBody & IGeneralEntityProperties & {
}