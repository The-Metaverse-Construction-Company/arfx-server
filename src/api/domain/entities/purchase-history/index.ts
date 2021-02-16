import {
  IPurchaseHistoryBody,
  IPurchaseHistoryEntity
} from './interfaces'
import {
  IGeneralEntityDependencies
} from '../../interfaces/index'
import { PURCHASE_HISTORY_STATE } from './enum'
import { IProductBlobProperties, ProductCoreEntity } from '../product'

export * from './enum'
export * from './interfaces'
export * from './repository-gateway-interfaces'

interface Dependencies extends IGeneralEntityDependencies {
}
export default ({
  generateId
}: Dependencies) => (
  class ProductHistoryEntity extends ProductCoreEntity implements IPurchaseHistoryEntity {
    public readonly _id!: string
    public readonly productId!: string
    public readonly amount!: number
    public readonly paymentMethodId!: string
    public paymentIntentId!: string
    public paymentChargeId!: string
    public state!: PURCHASE_HISTORY_STATE
    public readonly userId!: string
    public readonly discountPercentage!: number
    public readonly purchasedAt!: number
    public readonly createdAt!: number
    public readonly updatedAt!: number
    constructor ({
      productId = '',
      amount = 0,
      userId = '',
      paymentMethodId = '',
      paymentIntentId = '',
      paymentChargeId = '',
      description = '',
      name = '',
      discountPercentage = 0,
      price = 0,
      contentZip,
      previewImage,
      previewVideo,
      thumbnail,
      state = PURCHASE_HISTORY_STATE.PENDING,
      title = ''
    }: Partial<IPurchaseHistoryBody>) {
      super({
        name,
        title,
        description,
        contentZip,
        previewImage,
        previewVideo,
        thumbnail,
        discountPercentage,
        price
      })
      amount = parseFloat(<any>amount)
      if (isNaN(amount)) {
        throw new Error('Amount must be a numeric with 2 decimal places.')
      } else if (amount <= 0) {
        throw new Error('Amount must be greater than 0.')
      }
      // if (discountPercentage < 0) {
      //   throw new Error('discountPercentage must be greater than 0.')
      // }
      if (!productId) {
        throw new Error('productId must not be null, undefined or empty string.')
      }
      // if (!paymentMethodId) {
      //   throw new Error('paymentMethodId must not be null, undefined or empty string.')
      // }
      if (!userId) {
        throw new Error('userId must not be null, undefined or empty string.')
      }
      // add additional business rules here if needed.
      this._id = generateId()
      this.productId = productId
      this.paymentMethodId = paymentMethodId
      this.paymentIntentId = paymentIntentId
      this.paymentChargeId = paymentChargeId
      this.userId = userId
      this.amount = amount
      this.state = state
      this.purchasedAt = Date.now()
      this.updatedAt = Date.now()
      this.createdAt = Date.now()
    }
    
  }
)