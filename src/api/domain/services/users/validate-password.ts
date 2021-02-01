import { IGenerateToken } from '../../interfaces'
import { TOKEN_TYPE } from '../../../utils/constants'
import {
  IGeneralServiceDependencies
} from '../../interfaces'
import { IUserRepositoryGateway } from '../../entities/users'
interface IServiceDependencies extends IGeneralServiceDependencies<IUserRepositoryGateway>{
  // generateToken: IGenerateToken
  comparePassword(password: string, hashPassword: string): boolean
}
export class ValidateUserPasswordService {
  constructor (protected deps: IServiceDependencies) {
  }
  public validateOne = async (userId: string, password: string) => {
    try {
      // initiate user entity to run the validation for business rules.
      const user = await this.deps.repositoryGateway.findOne({
        _id: userId
      })
      if (!user || !(this.deps.comparePassword(password, user.password))) {
        throw new Error('Invalid credentials.')
      }
      // removing password field on responsing user data
      //@ts-ignore
      delete user.password
      // add some logs or notification.
      return user
    } catch (error) {
      console.log('failed to validate user password. \nError: ', error);
      throw error
    }
  }
}