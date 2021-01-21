import {
  IGeneralRepositoryGateway
} from '../../interfaces/general-repository-gateway'
import {
  IProductEntity
} from './interfaces'

export interface IProductRepositoryGateway extends IGeneralRepositoryGateway<IProductEntity> {
}