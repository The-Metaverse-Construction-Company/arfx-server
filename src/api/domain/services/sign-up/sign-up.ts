/**
 * @general_interfaces
 */
import { IGeneralServiceDependencies } from '../../interfaces'
/**
 * @constant
 */
import { TOKEN_TYPE } from '../../../utils/constants'
/**
 * @user_entity_interfaces
 */
import { IUserRepositoryGateway, IUserParams } from '../../entities/users'
/**
 * @user_services
 */
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
  /**
   * sign-up the customer/user
   * @param userData 
   */
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
      // console.log('error :>> ', error);
      throw error
    }
  }
}