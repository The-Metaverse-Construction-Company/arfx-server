import {
  UserEntity
} from '../../entities'
import UserModel from '../../../models/user.model'
import { IGenerateToken } from '../../interfaces'
import { TOKEN_TYPE } from '../../../utils/constants'
interface Deps {
  generateToken: IGenerateToken
  sendEmail(userId: string, token: string): Promise<any>
  validateEmail(data: {email: string, userId?: string}): Promise<any>
}
export default class UserSignUp {
  constructor (protected deps: Deps) {
  }
  public createOne = async ({
    email = '',
    name = '',
    password = '',
    role = ''
  }) => {
    try {
      // initiate user entity to run the validation for business rules.
      const newUser = new UserEntity({
        email,
        name,
        password,
        role,
      })
      // check duplicate email.
      await this.deps.validateEmail({email})
      // insert to repository.
      await UserModel.create(newUser)
      const token = await this.deps.generateToken({
        referenceId: newUser._id,
        tokenType: TOKEN_TYPE.SIGN_UP
      })
      // send email notifications
      await this.deps.sendEmail(newUser._id, token)
      //add some logs
      return {
        user: newUser,
        token
      }
    } catch (error) {
      console.log('error :>> ', error);
      throw error
    }
  }
}