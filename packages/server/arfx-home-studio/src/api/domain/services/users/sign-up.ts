import {
  UserEntity
} from '../../entities'
import UserModel from '../../../models/user.model'
interface Deps {
  generateToken(payload: {referenceId: string}): Promise<string>
  sendEmail(data: {userId: string, email: string, name: string, token: string}): Promise<any>
  validateEmail(data: {email: string, userId?: string}): Promise<any>
}
export default class UserSignUp {
  constructor (protected deps: Deps) {
  }
  signIn = async ({
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
      })
      // send email notifications
      await this.deps.sendEmail({
        userId: newUser._id,
        email: newUser.email.value,
        name: newUser.name,
        token: token
      })
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