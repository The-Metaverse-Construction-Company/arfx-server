import {
  UserEntity
} from '../../domain/entities'
import UserModel from '../../models/user.model'
interface Deps {
  generateToken(payload: {referenceId: string}): string
  sendEmail(data: {userId: string, email: string, name: string, token: string}): Promise<any>
  validateEmail(data: {email: string, userId?: string}): Promise<any>
}
export default ({
  generateToken,
  sendEmail,
  validateEmail,
}: Deps) => (
  class UserSignUp {
    constructor () {
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
        await validateEmail({email})
        // insert to repository.
        // await UserModel.create(newUser)
        const token = generateToken({
          referenceId: newUser._id,
        })
        console.log('token :>> ', token);
        // send email notifications
        await sendEmail({
          userId: newUser._id,
          email: newUser.email.value,
          name: newUser.name,
          token: token
        })
        //add some logs
        return newUser
      } catch (error) {
        console.log('error :>> ', error);
        throw error
      }
    }
  }
)