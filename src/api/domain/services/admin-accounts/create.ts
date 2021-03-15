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
  IAdminAccountsParams,
 } from '../../entities/admin-accounts'
 /**
  * @general_interfaces
  */
import { 
  IGeneralServiceDependencies,
  IMSGraphAPIGateway,
} from '../../interfaces'
/**
 * @admin_services
 */
import {
  AdminAccountValidateEmailService
} from './index'
interface IServiceDependencies extends IGeneralServiceDependencies<IAdminAccountRepositoryGateway>{
  adminAccountValidateEmailService: AdminAccountValidateEmailService
  MSGraphAPI: IMSGraphAPIGateway
}
export class CreateAdminAccountService {
  constructor (protected deps: IServiceDependencies) {
  }
  /**
   * create admin account.
   * @param adminParams 
   */
  public createOne = async (adminParams: IAdminAccountsParams & {azureAdId?: string}) => {
    try {
      const {
        azureAdId = ''
      } = adminParams
      // initiate admin entity to run the validation for business rules.
      const newAdminAccount = new AdminAccountsEntity({
        ...adminParams,
        email: {
          value: adminParams.email.toLowerCase(),
          verifiedAt: azureAdId ? Date.now() : 0,
          verified: !(!azureAdId)
        },
        oauth: {
          azureAd: azureAdId
        }
      })
      // check duplicate email.
      await this.deps.adminAccountValidateEmailService.validateOne(newAdminAccount.email.value)
      // create account on the ms graph api
      if (!azureAdId) {
        const azureAd = await this.deps.MSGraphAPI.createAdminAccount({
          fullName: `${newAdminAccount.firstName} ${newAdminAccount.lastName}`,
          username: newAdminAccount.email.value.split("@").shift()
        })
        newAdminAccount.oauth.azureAd = azureAd.id
      }
      // save to repository.
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