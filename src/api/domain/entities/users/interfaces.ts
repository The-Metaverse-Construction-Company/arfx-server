import {
  IGeneralEntityProperties,
  IGeneralVerificationEntityProperties
} from '../../interfaces/index'
export interface IUserParams {
  name: string
  email: string
  mobileNumber: string
  password: string
  role: string
}
export type IUserEntityBody = Omit<IUserParams, 'email' | 'mobileNumber'> & {
  email: IGeneralVerificationEntityProperties
  mobileNumber: IGeneralVerificationEntityProperties
  stripeCustomerId: string
}
export interface IUserAuthenticationServices {
  facebook: string
  google: string
}
export interface IUserEntity extends IUserEntityBody, IGeneralEntityProperties {
  service: IUserAuthenticationServices
}