import {
  IGeneralEntityProperties
} from '../../interfaces/index'
export interface IProductBannerParams {
  productId: string // product id
  adminAccountId: string // admin who added/created the banner
  active: boolean // toggle to see if the banner is active
  indexNo: number // index number or sort number of the banner
}
export interface IProductBannerBody extends IProductBannerParams {}
export interface IProductBannerEntity extends IProductBannerBody, IGeneralEntityProperties {}