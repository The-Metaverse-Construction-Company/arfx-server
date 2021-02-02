import {
  IUserProductsEntity
} from './interfaces'
import {
  IGeneralEntityDependencies
} from '../../interfaces/index'

export * from './interfaces'
export * from './repository-gateway-interfaces'

interface Dependencies extends IGeneralEntityDependencies {
}
export default ({
  generateId
}: Dependencies) => (
  class ProductEntity implements IUserProductsEntity {
    public readonly _id!: string
    public readonly name!: string
    public readonly title!: string
    public readonly description!: string
    public readonly userId!: string
    public readonly productId!: string
    public readonly contentURL!: string
    public readonly createdAt!: number
    public readonly updatedAt!: number
    constructor ({
      _id = '',
      name = '',
      description = '',
      contentURL = '',
      productId = '',
      userId = '',
      title = '',
      // stripeCustomerId = '',
      updatedAt = Date.now(),
      createdAt  = Date.now()
    }: Partial<IUserProductsEntity>) {
      if (!_id) {
        _id = generateId()
      }
      if (!title) {
        throw new Error('title must not be null, undefined or empty string.')
      } else if (title.length < 3) {
        throw new Error('title must atleast 3 characters.')
      }
      if (!description) {
        throw new Error('description must not be null, undefined or empty string.')
      }
      if (!productId) {
        throw new Error('productId must not be null, undefined or empty string.')
      }
      if (!userId) {
        throw new Error('userId must not be null, undefined or empty string.')
      }
      // add additional business rules here if needed.
      this._id = _id
      this.name = name
      this.description = description
      this.contentURL = contentURL
      this.productId = productId
      this.userId = userId
      this.title = title
      this.updatedAt = updatedAt
      this.createdAt = createdAt
    }
    
  }
)