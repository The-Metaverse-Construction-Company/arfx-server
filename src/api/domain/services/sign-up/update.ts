import { IRevokeToken } from '../../interfaces'
import { TOKEN_TYPE } from '../../../utils/constants'
import {
  IGeneralServiceDependencies
} from '../../interfaces'
import { IUserRepositoryGateway } from '../../entities/users'
import { UserEntity } from '../../entities'
import {UserDetailsService} from '../users'
interface IServiceDependencies extends IGeneralServiceDependencies<IUserRepositoryGateway>{
  revokeToken: IRevokeToken
  userDetails: UserDetailsService
  createStripeCustomer(data: {name: string, email: string}): Promise<string>
}
export class VerifiedUserService {
  constructor (protected deps: IServiceDependencies) {
  }
  public updateOne = async (userId: string) => {
    try {
      //fetch user details
      const user = await this.deps.userDetails.findOne(userId, {password: 0})
      // create account on stripe. 
      // reference: https://stripe.com/docs/api/customers
      const customerId = await this.deps.createStripeCustomer({
        email: user.email.value,
        name: user.name
      })
      // initiate user entity to validate the updated if allowed on the business rules.
      const validatedUser = new UserEntity({
        ...user,
        email: {
          value: user.email.value,
          verified: true,
          verifiedAt: Date.now()
        },
        stripeCustomerId: customerId
      })
      const updatedUser = await this.deps.repositoryGateway.updateOne({
        _id: userId
      }, {
        //@ts-expect-error
        "email.verified": validatedUser.email.verified,
        "email.verifiedAt": validatedUser.email.verifiedAt,
        stripeCustomerId: validatedUser.stripeCustomerId
      })
      await this.deps.revokeToken(userId, TOKEN_TYPE.SIGN_UP)
      // create stripe users
      
      //add some logs
      return updatedUser
    } catch (error) {
      throw error
    }
  }
}