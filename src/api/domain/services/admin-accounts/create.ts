import {
  AdminAccountsEntity
} from '../../entities'
import { IGeneralServiceDependencies, IGenerateToken } from '../../interfaces'
import { TOKEN_TYPE } from '../../../utils/constants'
import { 
  IAdminAccountRepositoryGateway,
  IAdminAccountsParams
 } from '../../entities/admin-accounts'
import {
  AdminAccountValidateEmailService
} from './index'
interface IServiceDependencies extends IGeneralServiceDependencies<IAdminAccountRepositoryGateway>{
  // generateToken: IGenerateToken
  // sendEmail(userId: string, token: string): Promise<any>
  adminAccountValidateEmailService: AdminAccountValidateEmailService
}
export class CreateAdminAccountService {
  constructor (protected deps: IServiceDependencies) {
  }
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