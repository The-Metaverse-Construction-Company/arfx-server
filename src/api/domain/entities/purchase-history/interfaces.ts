import {
  IGeneralEntityProperties
} from '../../interfaces/index'
import { IProductBlob, IProductParams } from '../product'
import { PURCHASE_HISTORY_STATE } from './enum'

export interface IPurchaseHistoryParams {
  productId: string // product id
  paymentMethodId: string // payment method used for the purchase. at customer profile on stripe UI.
  keepCardDetails: boolean
}
export interface IPurchaseHistoryBody extends Omit<IPurchaseHistoryParams, 'keepCardDetails'>, IProductParams, IProductBlob {
  amount: number // total amount of the purchase.
  userId: string // user who do the action purchase.
  paymentIntentId: string // paymentId/transactionId from stripe.
  paymentChargeId: string // payment charge Id from stripe.
  state: PURCHASE_HISTORY_STATE // state of the purchase.
}

export type IPurchaseHistoryEntity = IPurchaseHistoryBody & IGeneralEntityProperties & {
  purchasedAt: number // milis of the purchase. added for sure, even it already have a createdAt milis.
}