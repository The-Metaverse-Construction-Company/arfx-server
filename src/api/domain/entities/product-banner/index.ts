import {
  IProductBannerEntity
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
  class ProductBannerEntity implements IProductBannerEntity {
    public readonly _id!: string
    public readonly adminAccountId!: string
    public readonly active: boolean = false
    public readonly indexNo: number = 0
    public readonly productId!: string
    public readonly createdAt!: number
    public readonly updatedAt!: number
    constructor ({
      _id = '',
      productId = '',
      adminAccountId = '',
      active = false,
      indexNo = 0,
      updatedAt = Date.now(),
      createdAt  = Date.now()
    }: Partial<IProductBannerEntity>) {
      if (!_id) {
        _id = generateId()
      }
      if (!adminAccountId) {
        throw new Error('adminAccountId must not be null, undefined or empty string.')
      }
      if (!productId) {
        throw new Error('productId must not be null, undefined or empty string.')
      }
      // add additional business rules here if needed.
      this._id = _id
      this.productId = productId
      this.adminAccountId = adminAccountId
      this.active = active
      this.indexNo = indexNo
      this.updatedAt = updatedAt
      this.createdAt = createdAt
    }
    
  }
)