import {
  IGeneralEntityDependencies, IGeneralVerificationEntityProperties,
} from '../../interfaces'
import {
  IAdminAccountsEntity
} from './interfaces'
import {
  ADMIN_ROLE_LEVEL
} from './constants'

export * from './interfaces'
export * from './constants'
export * from './repository-gateway-interfaces'

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
  class AdminAccountsEntity implements IAdminAccountsEntity {
    public readonly _id: string = '';
    
    public readonly firstName!: string
    public readonly lastName!: string
    public readonly roleLevel!: number
    public email!: IGeneralVerificationEntityProperties
    public password: string = '';
    public readonly createdAt: number = 0;
    public readonly updatedAt: number = 0;
    constructor ({
      _id = '',
      firstName = '',
      lastName = '',
      roleLevel = ADMIN_ROLE_LEVEL.USER,
      email = {value: '', verified: false, verifiedAt: 0},
      password = '',
    }: Partial<IAdminAccountsEntity>) {
      if (!_id) {
        _id = generateId()
      }
      if (!firstName) {
        throw new Error('firstName must not be null, undefined or empty string.')
      }
      if (!lastName) {
        throw new Error('lastName must not be null, undefined or empty string.')
      }
      if (!email) {
        throw new Error('email must not be null, undefined or empty string.')
      }
      // add more validation for email liek the format of it.
      if (!password) {
        throw new Error('password must not be null, undefined or empty string.')
      }
      // add more validation on password like the format of it.
      this._id = _id
      this.email = email
      this.firstName = firstName
      this.lastName = lastName
      this.roleLevel = roleLevel
      this.password = hash(password)
      // this.avatarUrl = avatarUrl
      this.createdAt = Date.now()
      this.updatedAt = Date.now()
    }
  }
)