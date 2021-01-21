import {v4 as uuidV4} from 'uuid'
import bcrypt from 'bcryptjs'
import User from './users'
import Product from './product'


export const UserEntity = User({generateId: uuidV4, hash: (pwd: string) => {
  const hashPassword = bcrypt.hashSync(pwd, 10)
  return hashPassword
}})
export const ProductEntity = Product({generateId: uuidV4})