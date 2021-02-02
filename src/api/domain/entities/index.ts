import {v4 as uuidV4} from 'uuid'
import bcrypt from 'bcryptjs'
import User from './users'
import Product from './product'
import PurchaseHistory from './purchase-history'
import UserProducts from './user-products'
import AdminAccounts from './admin-accounts'
import FeaturedProduct from './featured-product'

const hash = (pwd: string) => {
  const hashPassword = bcrypt.hashSync(pwd, 10)
  return hashPassword
}

export const UserEntity = User({generateId: uuidV4, hash: hash})
export const ProductEntity = Product({generateId: uuidV4})
export const PurchaseHistoryEntity = PurchaseHistory({generateId: uuidV4})
export const UserProductsEntity = UserProducts({generateId: uuidV4})
export const AdminAccountsEntity = AdminAccounts({generateId: uuidV4, hash})
export const FeaturedProductEntity = FeaturedProduct({generateId: uuidV4})
