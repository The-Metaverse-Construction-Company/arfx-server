import { IRevokeToken } from '../../interfaces'
import { TOKEN_TYPE } from '../../../utils/constants'
import {
  IGeneralServiceDependencies
} from '../../interfaces'
import { IUserRepositoryGateway } from '../../entities/users'
import { UserEntity } from '../../entities'
import {VerifyUserService} from '../users'
interface IServiceDependencies {
  revokeToken: IRevokeToken
  verifyUserService: VerifyUserService
}
export class VerifiedUserService {
  constructor (protected deps: IServiceDependencies) {
  }
  public updateOne = async (userId: string) => {
    try {
      //verify user by userId
      const updatedUser = await this.deps.verifyUserService.verifyOne(userId)
      //revoke or remove the token
      await this.deps.revokeToken(userId, TOKEN_TYPE.SIGN_UP)
      // create stripe users
      //add some logs
      return updatedUser
    } catch (error) {
      throw error
    }
  }
}