import {v4 as uuidV4} from 'uuid'
import bcrypt from 'bcryptjs'
import User from './users'
import Product from './product'
import PurchaseHistory from './purchase-history'
import UserProducts from './user-products'


export const UserEntity = User({generateId: uuidV4, hash: (pwd: string) => {
  const hashPassword = bcrypt.hashSync(pwd, 10)
  return hashPassword
}})
export const ProductEntity = Product({generateId: uuidV4})
export const PurchaseHistoryEntity = PurchaseHistory({generateId: uuidV4})
export const UserProductsEntity = UserProducts({generateId: uuidV4})