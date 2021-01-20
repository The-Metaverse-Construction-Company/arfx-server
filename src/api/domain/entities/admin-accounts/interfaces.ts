import {
  IGeneralEntityProperties,
} from '../../interfaces/index'
import {
  IGeneralVerificationEntityProperties
} from '../../interfaces'

export interface IAdminAccountsParams {
  firstName: string
  lastName: string
  roleLevel: number
  password: string
  email: string
}
export interface IAdminAccountsEntityBody extends Omit<IAdminAccountsParams, 'email'> {
  email: IGeneralVerificationEntityProperties
}
export interface IAdminAccountsEntity extends IAdminAccountsEntityBody, IGeneralEntityProperties {
}