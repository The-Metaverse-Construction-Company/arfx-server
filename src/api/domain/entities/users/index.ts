import {
  IGeneralEntityDependencies, IGeneralVerificationEntityProperties,
} from '../../interfaces'
import {
  IUserAuthenticationServices,
  IUserEntity,
} from './interfaces'
export * from './interfaces'
export * from './constants'
export * from './RepositoryGatewayInterfaces'

const { ALLOWED_USER_ROLE } = require("./constants")
const allowed_roles = Object.values(ALLOWED_USER_ROLE)
interface IDeps extends IGeneralEntityDependencies {
  hash(pwd: string): string
  validateEmail(email: string): boolean
}
export default ({
  generateId,
  hash,
  validateEmail
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
  class UserEntity implements IUserEntity {
    public readonly _id: string = '';
    public email!: IGeneralVerificationEntityProperties
    public mobileNumber!: IGeneralVerificationEntityProperties;
    public service!: IUserAuthenticationServices;
    public name: string = '';
    public role: string = '';
    public suspended: boolean = false;
    public stripeCustomerId: string = '';
    public password: string = '';
    public readonly createdAt: number = 0;
    public readonly updatedAt: number = 0;
    constructor ({
      _id = '',
      name = '',
      email = {value: '', verified: false, verifiedAt: 0},
      mobileNumber = {value: '', verified: false, verifiedAt: 0},
      password = '',
      role = '',
      stripeCustomerId = '',
      suspended = false
    }: Partial<IUserEntity>) {
      if (!_id) {
        _id = generateId()
      }
      if (!allowed_roles.includes(role)) {
        throw new Error(`Invalid user roles. Valid Roles: ${allowed_roles.join(', ')}.`)
      }
      if (!email.value) {
        throw new Error('email is required to initialize user entity.')
      } else if (!validateEmail(email.value)) {
        throw new Error('invalid email address format.')
      }
      if (suspended && typeof(suspended) !== 'boolean') {
        throw new Error(`suspended must be a boolean. found: ${typeof(suspended)}`)
      }
      this._id = _id
      this.email = email
      this.mobileNumber = mobileNumber
      this.name = name
      this.role = role
      this.suspended = suspended
      this.stripeCustomerId = stripeCustomerId
      this.password = hash(password)
      // this.avatarUrl = avatarUrl
      this.createdAt = Date.now()
      this.updatedAt = Date.now()
      this.service = {
        facebook: '',
        google: '',
      }
    }
  }
)