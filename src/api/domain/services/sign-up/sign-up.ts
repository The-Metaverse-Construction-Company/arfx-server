import {
  UserEntity
} from '../../entities'
import { IGeneralServiceDependencies, IGenerateToken } from '../../interfaces'
import { TOKEN_TYPE } from '../../../utils/constants'
import { IUserRepositoryGateway } from '../../entities/users'
interface IServiceDependencies extends IGeneralServiceDependencies<IUserRepositoryGateway>{
  generateToken: IGenerateToken
  sendEmail(userId: string, token: string): Promise<any>
  validateEmail(data: {email: string, userId?: string}): Promise<any>
}
export class UserSignUpService {
  constructor (protected deps: IServiceDependencies) {
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
        email: {
          value: email,
          verifiedAt: 0,
          verified: false
        },
        name,
        password,
        role,
      })
      // check duplicate email.
      await this.deps.validateEmail({email: newUser.email.value})
      console.log('object :>> ', JSON.stringify(newUser, null, 2));
      // insert to repository.
      await this.deps.repositoryGateway.insertOne(newUser)
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