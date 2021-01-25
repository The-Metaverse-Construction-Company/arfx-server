import {
  IGeneralEntityProperties,
} from '../../interfaces/index'
import {
  IProductParams
} from '../product'
export interface IUserProductsParams extends IProductParams {
  userId: string
  // productURL: string
  // name: string
  // // originalName: string // store the original name of the product
  // title: string
  // description: string
  productId: string // just a reference thru the product
}
export interface IUserProductsEntityBody extends IUserProductsParams {
}
export interface IUserProductsEntity extends IUserProductsEntityBody, IGeneralEntityProperties {
}