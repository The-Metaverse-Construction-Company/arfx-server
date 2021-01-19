import {
  IGeneralEntityProperties,
  IGeneralVerificationEntityProperties
} from '../../interfaces/index'
export interface IUserParams {
  name: string
  email: string
  mobileNumber: string
  password: string
}
export type IUserEntityBody = IUserParams & {
  email: IGeneralVerificationEntityProperties
  mobileNumber: IGeneralVerificationEntityProperties
}

export interface IUserEntity extends IUserEntityBody, IGeneralEntityProperties {
  role: string
  service: {
    facebook: string
    google: string
  }
}