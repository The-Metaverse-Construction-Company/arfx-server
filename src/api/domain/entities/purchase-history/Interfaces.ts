import {
  IGeneralEntityProperties
} from '../../interfaces/index'

export interface IPurchaseHistoryParams {
  productId: string // product id
  paymentMethodId: string // payment method used for the purchase. at customer profile on stripe UI.
  keepCardDetails: boolean
}
export interface IPurchaseHistoryBody extends Omit<IPurchaseHistoryParams, 'keepCardDetails'> {
  amount: number // total amount of the purchase.
  userId: string // user who do the action purchase.
  paymentIntentId: string // paymentId/transactionId from stripe.
}

export type IPurchaseHistoryEntity = IPurchaseHistoryBody & IGeneralEntityProperties & {
  purchasedAt: number // milis of the purchase. added for sure, even it already have a createdAt milis.
}