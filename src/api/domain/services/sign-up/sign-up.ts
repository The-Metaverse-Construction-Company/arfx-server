import {
  UserEntity
} from '../../entities'
import { IGeneralServiceDependencies, IGenerateToken } from '../../interfaces'
import { TOKEN_TYPE } from '../../../utils/constants'
import { IUserRepositoryGateway, IUserParams } from '../../entities/users'
import {
  SendUserOTPService
} from '../users'
interface IServiceDependencies extends IGeneralServiceDependencies<IUserRepositoryGateway>{
  sendUserOTPService: SendUserOTPService
  validateEmail(data: {email: string, userId?: string}): Promise<any>
}
export class UserSignUpService {
  constructor (protected deps: IServiceDependencies) {
  }
  public createOne = async ({
    email = '',
    name = '',
    password = '',
    role = '',
    mobileNumber = ''
  }: IUserParams) => {
    try {
      // initiate user entity to run the validation for business rules.
      const newUser = new UserEntity({
        email: {
          value: email,
          verifiedAt: 0,
          verified: false
        },
        mobileNumber: {
          value: mobileNumber,
          verifiedAt: 0,
          verified: false
        },
        name,
        password,
        role,
      })
      // check duplicate email.
      await this.deps.validateEmail({email: newUser.email.value})
      // insert user to the repository.
      await this.deps.repositoryGateway.insertOne(newUser)
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