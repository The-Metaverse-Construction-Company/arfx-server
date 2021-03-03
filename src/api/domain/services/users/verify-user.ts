/**
 * @general_interfaces
 */
import {
  IGeneralServiceDependencies
} from '../../interfaces'
/**
 * @entity_interfaces
 */
import { IUserRepositoryGateway } from '../../entities/users'
/**
 * @entity
 */
import { UserEntity } from '../../entities'
/**
 * @services
 */
import {UserDetailsService} from '../users'
interface IServiceDependencies extends IGeneralServiceDependencies<IUserRepositoryGateway>{
  userDetails: UserDetailsService
  createPaymentGatewayAccount(data: {name: string, email: string}): Promise<string>
}
export class VerifyUserService {
  constructor (protected deps: IServiceDependencies) {
  }
  /**
   * verify one user/customer
   * @param userId 
   */
  public verifyOne = async (userId: string) => {
    try {
      //get user details
      const user = await this.deps.userDetails.findOne(userId, {password: 0})
      // create account on stripe. 
      // reference: https://stripe.com/docs/api/customers
      const customerId = await this.deps.createPaymentGatewayAccount({
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
      // verified user and set the stripe customer id
      const updatedUser = await this.deps.repositoryGateway.updateOne({
        _id: userId
      }, {
        //@ts-expect-error
        "email.verified": validatedUser.email.verified,
        "email.verifiedAt": validatedUser.email.verifiedAt,
        stripeCustomerId: validatedUser.stripeCustomerId
      })
      delete updatedUser.password 
      //add some logs
      return updatedUser
    } catch (error) {
      throw error
    }
  }
}