import {
  IGeneralEntityDependencies
} from '../../interfaces'

export * from './interfaces'

const { ALLOWED_USER_ROLE } = require("./constants")
const allowed_roles = Object.values(ALLOWED_USER_ROLE)
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
  class UserEntity {
    public _id: string = '';
    public email: {
      value: string,
      verified: boolean,
      verifiedAt: number 
    }
    public mobileNumber: {
      value: string,
      verified: boolean,
      verifiedAt: number 
    };
    public services: {
      facebook: string,
      google: string,
    };
    public name: string = '';
    public role: string = '';
    public password: string = '';
    public avatarUrl: string = '';
    public createdAt: number = 0;
    public updatedAt: number = 0;
    constructor ({
      _id = '',
      name = '',
      email = '',
      mobileNumber = '',
      role = '',
      password = '',
      avatarUrl = ''
    }: any) {
      if (!_id) {
        _id = generateId()
      }
      if (!allowed_roles.includes(role)) {
        throw new Error(`Invalid user roles. Valid Roles: ${allowed_roles.join(', ')}.`)
      }
      this._id = _id
      this.email = {
        value: email,
        verified: false,
        verifiedAt: 0
      }
      this.mobileNumber = {
        value: mobileNumber,
        verified: false,
        verifiedAt: 0
      }
      this.name = name
      this.role = role
      this.password = hash(password)
      this.avatarUrl = avatarUrl
      this.createdAt = Date.now()
      this.updatedAt = Date.now()
      this.services = {
        facebook: '',
        google: '',
      }
    }
  }
)