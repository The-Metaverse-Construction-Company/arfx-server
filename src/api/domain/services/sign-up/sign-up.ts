import {
  UserEntity
} from '../../entities'
import { IGeneralServiceDependencies, IGenerateToken } from '../../interfaces'
import { TOKEN_TYPE } from '../../../utils/constants'
import { IUserRepositoryGateway, IUserParams } from '../../entities/users'
import {
  SendUserOTPService,
  CreateUserService
} from '../users'
interface IServiceDependencies extends IGeneralServiceDependencies<IUserRepositoryGateway>{
  sendUserOTPService: SendUserOTPService
  createUserService: CreateUserService
}
export class UserSignUpService {
  constructor (protected deps: IServiceDependencies) {
  }
  public createOne = async (userData: IUserParams) => {
    try {
      // create user
      const newUser = await this.deps.createUserService.createOne(userData)
      // generate OTP and send it thru email or text.
      const token = await this.deps.sendUserOTPService.sendOne(newUser._id, TOKEN_TYPE.SIGN_UP)
      // generate token for sign up
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