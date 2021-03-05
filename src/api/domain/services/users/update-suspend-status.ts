/**
 * @general_interfaces
 */
import { IGeneralServiceDependencies } from '../../interfaces'
/**
 * @user_entity_interfaces
 */
import { IUserRepositoryGateway } from '../../entities/users'
interface IServiceDependencies extends IGeneralServiceDependencies<IUserRepositoryGateway>{
}
export class UpdateUserSuspendStatusService {
  constructor (protected deps: IServiceDependencies) {
  }
  /**
   * update suspend status of the customer/user
   * @param userId 
   * @param suspendStatus 
   */
  public updateOne = async (userId: string, suspendStatus: boolean) => {
    try {
      // initiate user entity to run the validation for business rules.
      // update user entity in the repository.
      const updatedUser = await this.deps.repositoryGateway.updateOne({
        _id: userId
      }, {
        suspended: suspendStatus
      })
      //@ts-ignore
      delete updatedUser.password
      //add some logs
      return updatedUser
    } catch (error) {
      console.log('failed to update suspend status of the user. \nError: ', error);
      throw error
    }
  }
}