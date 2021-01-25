import {
  IGeneralRepositoryGateway
} from '../../interfaces/general-repository-gateway'
import {
  IUserProductsEntity
} from './interfaces'

export interface IUserProductsRepositoryGateway extends IGeneralRepositoryGateway<IUserProductsEntity> {
}