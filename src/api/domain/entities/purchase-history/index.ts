import {
  IPurchaseHistoryBody,
  IPurchaseHistoryEntity
} from './interfaces'
import {
  IGeneralEntityDependencies
} from '../../interfaces/index'
import { PURCHASE_HISTORY_STATE, ALLOWED_PURCHASE_HISTORY_STATES } from './enum'
import { ProductCoreEntity } from '../product'
export * from './enum'
export * from './interfaces'
export * from './repository-gateway-interfaces'
interface Dependencies extends IGeneralEntityDependencies {
}
export default ({
  generateId,
}: Dependencies) => (
  class ProductHistoryEntity extends ProductCoreEntity({generateId}) implements IPurchaseHistoryEntity {
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
      amount = parseFloat(this.validateNumber(amount, 'amount') as any) 
      if (this.validateString(productId, 'productId')) {
        // add additional business rules here if needed.
      }
      if (this.validateString(userId, 'userId')) {
        // add additional business rules here if needed.
      }
      if (this.validateString(paymentIntentId, 'paymentIntentId', false)) {
        // add additional business rules here if needed.
      }
      if (this.validateString(paymentMethodId, 'paymentMethodId', false)) {
        // add additional business rules here if needed.
      }
      if (this.validateString(paymentChargeId, 'paymentChargeId', false)) {
        // add additional business rules here if needed.
      }
      state = this.validateNumber(state, 'state')
      if (!ALLOWED_PURCHASE_HISTORY_STATES.includes(state)) {
        throw new Error(`Invalid state value. only allowed states are ${ALLOWED_PURCHASE_HISTORY_STATES.join(', ')}.`)
      }
      // add additional business rules here if needed.
      this.productId = productId
      this.paymentMethodId = paymentMethodId || ''
      this.paymentIntentId = paymentIntentId || ''
      this.paymentChargeId = paymentChargeId || ''
      this.userId = userId
      this.amount = parseFloat(this.validateNumber(amount, 'state').toString())
      this.state = this.validateNumber(state, 'state')
      this.purchasedAt = Date.now()
    }
    
  }
)