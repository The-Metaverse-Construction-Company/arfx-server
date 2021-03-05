/**
 * @admin_entitiy
 */
import {
  AdminAccountsEntity
} from '../../entities'
/**
 * @admin_entity_interfaces
 */
import { 
  IAdminAccountRepositoryGateway,
  IAdminAccountsParams
 } from '../../entities/admin-accounts'
 /**
  * @general_interfaces
  */
import { IGeneralServiceDependencies, IGenerateToken } from '../../interfaces'
/**
 * @admin_services
 */
import {
  AdminAccountValidateEmailService
} from './index'
interface IServiceDependencies extends IGeneralServiceDependencies<IAdminAccountRepositoryGateway>{
  adminAccountValidateEmailService: AdminAccountValidateEmailService
}
export class CreateAdminAccountService {
  constructor (protected deps: IServiceDependencies) {
  }
  /**
   * create admin account.
   * @param requestParams 
   */
  public createOne = async (requestParams: IAdminAccountsParams) => {
    try {
      // initiate admin entity to run the validation for business rules.
      const newAdminAccount = new AdminAccountsEntity({
        ...requestParams,
        email: {
          value: requestParams.email,
          verifiedAt: 0,
          verified: false
        },
      })
      // check duplicate email.
      await this.deps.adminAccountValidateEmailService.validateOne(newAdminAccount.email.value)
      // insert to repository.
      await this.deps.repositoryGateway.insertOne(newAdminAccount)
      // const token = await this.deps.generateToken({
      //   referenceId: newAdminAccount._id,
      //   tokenType: TOKEN_TYPE.SIGN_UP
      // })
      // send email notifications
      // await this.deps.sendEmail(newAdminAccount._id, token)
      //add some logs
      //@ts-ignore
      delete newAdminAccount.password
      return {
        admin: newAdminAccount,
        // token
      }
    } catch (error) {
      console.log('error :>> ', error);
      throw error
    }
  }
}