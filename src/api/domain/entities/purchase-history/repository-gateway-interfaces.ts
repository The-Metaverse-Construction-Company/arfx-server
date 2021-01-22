import {
  IGeneralRepositoryGateway
} from '../../interfaces/general-repository-gateway'
import {
  IPurchaseHistoryEntity
} from './interfaces'

export interface IPurchaseHistorryRepositoryGateway extends IGeneralRepositoryGateway<IPurchaseHistoryEntity> {
}