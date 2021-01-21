import {
  IPurchaseHistoryBody,
  IPurchaseHistoryEntity
} from './Interfaces'
import {
  IGeneralEntityDependencies
} from '../../interfaces/index'

export * from './Interfaces'
export * from './RepositoryGatewayInterfaces'

interface Dependencies extends IGeneralEntityDependencies {
}
export default ({
  generateId
}: Dependencies) => (
  class ProductEntity implements IPurchaseHistoryEntity {
    public readonly _id!: string
    public readonly productId!: string
    public readonly amount!: number
    public readonly paymentMethodId!: string
    public readonly discountPercentage!: number
    public readonly purchasedAt!: number
    public readonly createdAt!: number
    public readonly updatedAt!: number
    constructor ({
      productId = '',
      amount = 0,
      discountPercentage = 0,
      paymentMethodId = '',
    }: Partial<IPurchaseHistoryBody>) {
      amount = parseFloat(<any>amount)
      if (isNaN(amount)) {
        throw new Error('Amount must be a numeric with 2 decimal places.')
      } else if (amount <= 0) {
        throw new Error('Amount must be greater than 0.')
      }
      if (discountPercentage <= 0) {
        throw new Error('discountPercentage must be greater than 0.')
      }
      if (!productId) {
        throw new Error('productId must not be null, undefined or empty string.')
      }
      if (!paymentMethodId) {
        throw new Error('paymentMethodId must not be null, undefined or empty string.')
      }
      // add additional business rules here if needed.
      this._id = generateId()
      this.productId = productId
      this.paymentMethodId = paymentMethodId
      this.amount = amount
      this.discountPercentage = discountPercentage
      this.purchasedAt = Date.now()
      this.updatedAt = Date.now()
      this.createdAt = Date.now()
    }
    
  }
)