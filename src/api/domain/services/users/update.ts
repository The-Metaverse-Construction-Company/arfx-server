/**
 * @entity
 */
import {
  UserEntity
} from '../../entities'
/**
 * @general_interfaces
 */
import { IGeneralServiceDependencies } from '../../interfaces'
/**
 * @user_entity_interfaces
 */
import { IUserRepositoryGateway, IUserParams } from '../../entities/users'
/**
 * @services
 */
import {UserDetailsService} from './user-details'
interface IServiceDependencies extends IGeneralServiceDependencies<IUserRepositoryGateway>{
  validateEmail(email: string, option: {userId?: string}): Promise<any>
  userDetailsService: UserDetailsService
}
export class UpdateUserService {
  constructor (protected deps: IServiceDependencies) {
  }
  /**
   * update user/customer metadata.
   * @param userId 
   * @param userData 
   */
  public updateOne = async (userId: string, userData: IUserParams) => {
    try {
      const {
        email = '',
        name = '',
        role = '',
        mobileNumber = ''
      } = userData
      // get user data, to check if the user really existed.
      const user = await this.deps.userDetailsService.findOne(userId)
      // initiate user entity to run the validation for business rules.
      const newUser = new UserEntity({
        _id: userId,
        email: {
          value: email,
          verifiedAt: 0,
          verified: user.email.value === email ? user.email.verified : false
        },
        mobileNumber: {
          value: mobileNumber,
          verifiedAt: 0,
          verified: user.mobileNumber.value === mobileNumber ? user.mobileNumber.verified : false
        },
        name,
        role,
      })
      // check duplicate email on the repository
      await this.deps.validateEmail(newUser.email.value, {userId: newUser._id})
      // update user entity in the repository.
      await this.deps.repositoryGateway.updateOne({
        _id: newUser._id
      }, {
        name: newUser.name,
        email: newUser.email,
        mobileNumber: newUser.mobileNumber,
        role: newUser.role,
      })
      //@ts-ignore
      delete newUser.password
      //add some logs
      return newUser
    } catch (error) {
      console.log('failed to create new user. \nError: ', error);
      throw error
    }
  }
}