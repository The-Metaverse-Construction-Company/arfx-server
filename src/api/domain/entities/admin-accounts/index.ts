import {
  IGeneralEntityDependencies, IGeneralVerificationEntityProperties,
} from '../../interfaces'
import {
  IAdminAccountsEntity
} from './interfaces'
import {
  ADMIN_ROLE_LEVEL,
  ALLOWED_ADMIN_ROLE_LEVEL
} from './constants'

export * from './interfaces'
export * from './constants'
export * from './repository-gateway-interfaces'

import GeneralEntity from '../general'
import e from 'express'
interface IDeps extends IGeneralEntityDependencies {
  hash(pwd: string): string 
}
export default ({
  generateId,
  hash
}: IDeps) => (
  /**
   * _id: user id
   * name: name of the user
   * email: email of the user
   * role: admin/user
   * password: hashed password 
   * mobileNumber: mobileNumber
   * avatarUrl: profileUrl or avatar of the user
   */
  class AdminAccountsEntity extends GeneralEntity({generateId}) implements IAdminAccountsEntity {
    public readonly firstName!: string
    public readonly lastName!: string
    public readonly roleLevel!: number
    public email!: IGeneralVerificationEntityProperties
    public password: string = '';
    constructor ({
      _id = '',
      firstName = '',
      lastName = '',
      roleLevel = ADMIN_ROLE_LEVEL.USER,
      email = {value: '', verified: false, verifiedAt: 0},
      password = '',
    }: Partial<IAdminAccountsEntity>) {
      super()
      if (this.validateString(firstName, 'firstName')) {
      // add more business rule validation here.
      }
      if (this.validateString(lastName, 'lastName')) {
      // add more business rule validation here.
      }
      if (this.validateString(password, 'password')) {
      // add more validation like the format of it.
        password = hash(password)
      }
      email.value = this.validateString(email.value, 'email.value')
        // add more business rule validation here.
        // add more validation like the format of it.
      email.verified = this.validateBoolean(email.verified, 'email.verified')
        // add more business rule validation here.
      email.verifiedAt = this.validateNumber(email.verifiedAt, 'email.verifiedAt')
        // add more business rule validation here.
      roleLevel = this.validateNumber(roleLevel, 'roleLevel')
      if (!ALLOWED_ADMIN_ROLE_LEVEL.includes(roleLevel)) {
        throw new Error(`Invalid role level. allowed roleLevel are ${ALLOWED_ADMIN_ROLE_LEVEL.join(', ')}. found: ${roleLevel}`)
      }
        // add more business rule validation here.
      this.email = email
      this.firstName = firstName
      this.lastName = lastName
      this.roleLevel = roleLevel
      this.password = password
    }
  }
)