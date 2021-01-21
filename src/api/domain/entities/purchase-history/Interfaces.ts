import {
  IGeneralEntityProperties
} from '../../interfaces/index'

export type IPurchaseHistoryBody = {
  productId: string // product id
  amount: number // total amount of the purchase.
  paymentMethodId: string // payment method used for the purchase. at customer profile on stripe UI.
  discountPercentage: number // discount of the product when it purchase.
}

export type IPurchaseHistoryEntity = IPurchaseHistoryBody & IGeneralEntityProperties & {
  purchasedAt: number // milis of the purchase. added for sure, even it already have a createdAt milis.
}