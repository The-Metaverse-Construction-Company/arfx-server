import {
  IProductEntity
} from './interfaces'
import {
  IGeneralEntityDependencies
} from '../../interfaces/index'

export * from './interfaces'
export * from './RepositoryGatewayInterfaces'

interface Dependencies extends IGeneralEntityDependencies {
  
}
export default ({
  generateId
}: Dependencies) => (
  class ProductEntity implements IProductEntity {
    public readonly _id!: string
    public readonly name!: string
    public readonly title!: string
    public readonly description!: string
    public readonly published: boolean = false
    // public readonly stripeCustomerId!: string
    public readonly price!: number
    public readonly sceneURL!: string
    public readonly createdAt!: number
    public readonly updatedAt!: number
    constructor ({
      _id = '',
      name = '',
      description = '',
      price = 0,
      sceneURL = '',
      title = '',
      published = false,
      // stripeCustomerId = '',
      updatedAt = Date.now(),
      createdAt  = Date.now()
    }: Partial<IProductEntity>) {
      
      if (!_id) {
        _id = generateId()
      }
      // add additional business rules here if needed.
      this._id = _id
      this.name = name
      this.description = description
      this.price = price
      this.sceneURL = sceneURL
      this.title = title
      this.published = published
      // this.stripeCustomerId = stripeCustomerId
      this.updatedAt = updatedAt
      this.createdAt = createdAt
    }
    
  }
)