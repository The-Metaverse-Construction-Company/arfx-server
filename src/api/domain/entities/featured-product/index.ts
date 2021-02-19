import {
  IFeaturedProductEntity
} from './interfaces'
import {
} from '../../interfaces/general-repository-gateway'
export * from './interfaces'
export * from './repository-gateway-interfaces'
import GeneralEntity from '../general'
import { IGeneralEntityDependencies } from '../../interfaces'
interface IDependenciesEntity extends IGeneralEntityDependencies {
}
export default ({
  generateId
}: IDependenciesEntity) => (
  class FeaturedProductEntity extends GeneralEntity({generateId}) implements IFeaturedProductEntity {
    protected generateId(): string {
      return generateId()
    }
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
      super({
        _id,
        createdAt,
        updatedAt
      })
      if (this.validateString(adminAccountId, 'adminAccountId')) {
        // add more validations here.
      }
      if (this.validateString(productId, 'productId')) {
        // add more validations here.
      }
      if (this.validateBoolean(active, 'active', false)) {
        // add more validations here.
      }
      if (this.validateNumber(indexNo, 'indexNo', false)) {
        // check if the indexNo is null, then if not, parse the value to number else set a default value to 0
        indexNo = indexNo ? Number(indexNo) : 0
      }
      // add additional business rules here if needed.
      this.productId = productId
      this.adminAccountId = adminAccountId
      this.active = active
      this.indexNo = indexNo
    }
  }
)