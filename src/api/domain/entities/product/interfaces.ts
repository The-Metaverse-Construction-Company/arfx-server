import {
  IGeneralEntityProperties
} from '../../interfaces/index'

export interface IProductParams {
  name: string // some internal name
  title: string // title of the scene
  description: string // description of the scene
  productURL: string // url of the product or the scene,
}
export interface IProdutBody extends IProductParams {
  discountPercentage: number // discount of the scene/product
  price: number // price of the scene. float
  published: boolean // toggle if it will show it portal or not.
}

export type IProductEntity = IProdutBody & IGeneralEntityProperties & {
}