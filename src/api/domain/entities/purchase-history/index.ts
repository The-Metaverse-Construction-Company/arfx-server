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
    // public readonly name!: string
    // public readonly title!: string
    // public readonly description!: string
    // public readonly contentZip!: IProductBlobProperties
    // public readonly previewImage!: IProductBlobProperties
    // public readonly previewVideo!: IProductBlobProperties
    public paymentIntentId!: string
    public state!: PURCHASE_HISTORY_STATE
    public readonly userId!: string
    public readonly discountPercentage!: number
    public readonly purchasedAt!: number
    public readonly createdAt!: number
    public readonly updatedAt!: number
    constructor ({
      productId = '',
      amount = 0,
      paymentMethodId = '',
      userId = '',
      paymentIntentId = '',
      description = '',
      name = '',
      contentZip = {blobURL: '', originalFilepath: ''},
      previewImage = {blobURL: '', originalFilepath: ''},
      previewVideo = {blobURL: '', originalFilepath: ''},
      state = PURCHASE_HISTORY_STATE.PENDING,
      title = ''
    }: Partial<IPurchaseHistoryBody>) {
      super({
        name,
        title,
        description,
        contentZip,
        previewImage,
        previewVideo
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
      if (!paymentMethodId) {
        throw new Error('paymentMethodId must not be null, undefined or empty string.')
      }
      if (!userId) {
        throw new Error('userId must not be null, undefined or empty string.')
      }
      // add additional business rules here if needed.
      this._id = generateId()
      this.productId = productId
      this.paymentMethodId = paymentMethodId
      this.paymentIntentId = paymentIntentId
      this.userId = userId
      this.amount = amount
      this.state = state
      // this.title = title
      // this.name = name
      // this.description = description
      // this.contentZip = contentZip
      // this.previewImage = previewImage
      // this.previewVideo = previewVideo
      // this.discountPercentage = discountPercentage
      this.purchasedAt = Date.now()
      this.updatedAt = Date.now()
      this.createdAt = Date.now()
    }
    
  }
)