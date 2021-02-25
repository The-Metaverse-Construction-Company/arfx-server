import {
  UserEntity
} from '../../entities'
import { IGeneralServiceDependencies } from '../../interfaces'
import { IUserRepositoryGateway, IUserParams } from '../../entities/users'
interface IServiceDependencies extends IGeneralServiceDependencies<IUserRepositoryGateway>{
  validateEmail(data: {email: string, userId?: string}): Promise<any>
}
export class CreateUserService {
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
      //remove password property on the entity so it will not display on the response.
      delete newUser.password
      //add some logs
      return newUser
    } catch (error) {
      console.log('failed to create new user. Error: ', error);
      throw error
    }
  }
}