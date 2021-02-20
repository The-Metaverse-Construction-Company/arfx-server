import {
  IUserProductsEntity
} from './interfaces'
import {
  IGeneralEntityDependencies
} from '../../interfaces/index'

export * from './interfaces'
export * from './repository-gateway-interfaces'
import GeneralEntity from '../general'
interface Dependencies extends IGeneralEntityDependencies {
}
export default ({
  generateId
}: Dependencies) => (
  class UserProductEntity extends GeneralEntity({generateId}) implements IUserProductsEntity {
    public readonly _id!: string
    public readonly userId!: string
    public readonly productId!: string
    public readonly createdAt!: number
    public readonly updatedAt!: number
    constructor ({
      _id = '',
      productId = '',
      userId = '',
      updatedAt = Date.now(),
      createdAt  = Date.now()
    }: Partial<IUserProductsEntity>) {
      super({
        _id,
        createdAt,
        updatedAt
      })
      if (this.validateString(productId, 'productId')) {
        // add more business rules validation here if needed.
      }
      if (this.validateString(userId, 'userId')) {
        // add more business rules validation here if needed.
      }
      this.productId = productId
      this.userId = userId
    }
    
  }
)