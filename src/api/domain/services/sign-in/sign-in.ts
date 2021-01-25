import { IGenerateToken } from '../../interfaces'
import { TOKEN_TYPE } from '../../../utils/constants'
import {
  IGeneralServiceDependencies
} from '../../interfaces'
import { IUserRepositoryGateway } from '../../entities/users'
interface IServiceDependencies extends IGeneralServiceDependencies<IUserRepositoryGateway>{
  generateToken: IGenerateToken
  comparePassword(password: string, hashPassword: string): boolean
}
export class UserSignInService {
  constructor (protected deps: IServiceDependencies) {
  }
  public signIn = async ({
    username = '',
    password = '',
  }) => {
    try {
      // initiate user entity to run the validation for business rules.
      const user = await this.deps.repositoryGateway.findOne({
        //@ts-expect-error
        "email.value": username
      })
      if (!user || !(this.deps.comparePassword(password, user.password))) {
        throw new Error('Invalid credentials.')
      } else if (!user.email.verified) {
        throw new Error('Account not yet verified, Please verified your account first.')
      }
      const token = await this.deps.generateToken({
        referenceId: user._id,
        tokenType: TOKEN_TYPE.SIGN_IN
      })
      // removing password field on responsing user data
      //@ts-ignore
      delete user.password
      // add some logs or notification.
      return {
        user: user,
        token
      }
    } catch (error) {
      console.log('error :>> ', error);
      throw error
    }
  }
}