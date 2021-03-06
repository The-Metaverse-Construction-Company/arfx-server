/**
 * @user_entity
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
interface IServiceDependencies extends IGeneralServiceDependencies<IUserRepositoryGateway>{
  validateEmail(email, option?: {userId?: string}): Promise<any>
}
interface _ICreateUserParams extends IUserParams {
  azureAdUserId?: string
}
export class CreateUserService {
  constructor (protected deps: IServiceDependencies) {
  }
  /**
   * create user/customer
   * @param param0
   */
  public createOne = async ({
    email = '',
    name = '',
    password = '',
    role = '',
    mobileNumber = '',
    azureAdUserId = ''
  }: _ICreateUserParams) => {
    try {
      console.log('Creating users...');
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
        service: {
          azureAd: azureAdUserId,
          facebook: '',
          google: ''
        }
      })
      // check duplicate email.
      await this.deps.validateEmail(newUser.email.value)
      // insert user to the repository.
      await this.deps.repositoryGateway.insertOne(newUser)
      //remove password property on the entity so it will not display on the response.
      delete newUser.password
      //add some logs
      console.log('User created.');
      return newUser
    } catch (error) {
      console.log('failed to create new user. Error: ', error);
      throw error
    }
  }
}