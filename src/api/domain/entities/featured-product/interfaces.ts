import {
  IGeneralEntityProperties
} from '../../interfaces/index'
export interface IFeaturedProductParams {
  productId: string // product id
  adminAccountId: string // admin who added/created the banner
  active: boolean // toggle to see if the banner is active
  indexNo: number // index number or sort number of the banner
}
export interface IFeaturedProductBody extends IFeaturedProductParams {}
export interface IFeaturedProductEntity extends IFeaturedProductBody, IGeneralEntityProperties {}