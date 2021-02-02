import { IGenerateToken } from '../../interfaces'
import { TOKEN_TYPE } from '../../../utils/constants'
import {
  IGeneralServiceDependencies
} from '../../interfaces'
import { IUserRepositoryGateway } from '../../entities/users'
import {
  ValidateUserPasswordService
} from '../users'
interface IServiceDependencies extends IGeneralServiceDependencies<IUserRepositoryGateway>{
  generateToken: IGenerateToken
  validateUserPasswordService: ValidateUserPasswordService
  // comparePassword(password: string, hashPassword: string): boolean
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
      // validate account password
      await this.deps.validateUserPasswordService.validateOne(user._id, password)
      // if pass, then validate email if verified.
      if (!user.email.verified) {
        throw new Error('Account not yet verified, Please verify your account first.')
      }
      const token = await this.deps.generateToken({
        referenceId: user._id,
        tokenType: TOKEN_TYPE.SIGN_IN
      })
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