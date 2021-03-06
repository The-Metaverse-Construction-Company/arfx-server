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
  // generateToken: IGenerateToken
  // sendEmail(userId: string, token: string): Promise<any>
  adminAccountValidateEmailService: AdminAccountValidateEmailService
}
export class UpdateAdminAccountService {
  constructor (protected deps: IServiceDependencies) {
  }
  /**
   * update selected admin account.
   * @param adminAccountId 
   * @param requestParams 
   */
  public updateOne = async (adminAccountId: string, requestParams: IAdminAccountsParams) => {
    try {
      // initiate admin entity to run the validation for business rules.
      const newAdminAccount = new AdminAccountsEntity({
        _id: adminAccountId,
        ...requestParams,
        email: {
          value: requestParams.email,
          verifiedAt: 0,
          verified: false
        },
      })
      //validate email to repo and get the admin account details
      const adminAccount = await this.deps.adminAccountValidateEmailService.validateOne(newAdminAccount.email.value, newAdminAccount._id)
      // check duplicate email.
      // await this.deps.validateEmail({email: newAdminAccount.email.value})
      // insert to repository.
      await this.deps.repositoryGateway.updateOne({
        _id: adminAccountId,
      }, {
        firstName: newAdminAccount.firstName,
        lastName: newAdminAccount.lastName,
        roleLevel: newAdminAccount.roleLevel,
        //@ts-expect-error
        "email.value": newAdminAccount.email.value,
        // if its detect that the email is changed, then set the verified to false, if not, then just set the old value in it.
        "email.verified": adminAccount && (adminAccount.email.value === newAdminAccount.email.value) ? adminAccount.email.verified : false,
      })
      // const token = await this.deps.generateToken({
      //   referenceId: newAdminAccount._id,
      //   tokenType: TOKEN_TYPE.SIGN_UP
      // })
      // send email notifications
      // await this.deps.sendEmail(newAdminAccount._id, token)
      //add some logs
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