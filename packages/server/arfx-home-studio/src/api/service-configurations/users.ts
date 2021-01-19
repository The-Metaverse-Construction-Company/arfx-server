import {
  ValidateUserEmail,
  FindOneById,
  UserList
} from '../domain/services/users'
export const validateUserEmail = () => (
  new ValidateUserEmail()
)
export const userList = UserList()
export const findOneById = FindOneById()