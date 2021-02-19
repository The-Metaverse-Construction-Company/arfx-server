import {
  IFeaturedProductEntity
} from './interfaces'
import {
  IGeneralEntityDependencies
} from '../../interfaces/index'

export * from './interfaces'
export * from './repository-gateway-interfaces'
import {GeneralEntity} from '../index'
interface Dependencies {
}
export default ({
}: Dependencies) => (
  class FeaturedProductEntity extends GeneralEntity implements IFeaturedProductEntity {
    public readonly adminAccountId!: string
    public readonly active: boolean = false
    public readonly indexNo: number = 0
    public readonly productId!: string
    constructor ({
      _id = '',
      productId = '',
      adminAccountId = '',
      active = false,
      indexNo = 0,
      updatedAt = Date.now(),
      createdAt  = Date.now()
    }: Partial<IFeaturedProductEntity>) {
      super({_id, createdAt, updatedAt})
      if (this.validateString(adminAccountId, 'adminAccountId', true)) {
        // add more validations here.
      }
      if (this.validateString(productId, 'productId', true)) {
        // add more validations here.
      }
      if (this.validateBoolean(active, 'active')) {
        // add more validations here.
      }
      if (this.validateNumber(indexNo, 'indexNo')) {
        // add more validations here.
      }
      // add additional business rules here if needed.
      this.productId = productId
      this.adminAccountId = adminAccountId
      this.active = active
      this.indexNo = indexNo
    }
    
  }
)