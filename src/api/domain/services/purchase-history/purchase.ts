/**
 * @entity_interfaces
 */
import {
  IPurchaseHistorryRepositoryGateway, IPurchaseHistoryParams, PURCHASE_HISTORY_STATE
} from '../../entities/purchase-history'
/**
 * @entity
 */
import {
  PurchaseHistoryEntity
} from '../../entities'
/**
 * @services
 */
import {
  ProductDetailService
} from '../products'
import {
  UserDetailsService
} from '../users'
import {
  CreateUserProductsService,
  UserProductDetailsService
} from '../user-products'
/**
 * @general_interfaces
 */
import { IGeneralServiceDependencies } from '../../interfaces';
/**
 * @entity_user_interfaces
 */
import { IUserEntity } from '../../entities/users'
export interface IChargeCustomerPaymentParams {
  customerId: string,
  // paymentMethodId: string,
  amount: number
  user: IUserEntity
}
interface IDependencies extends IGeneralServiceDependencies<IPurchaseHistorryRepositoryGateway> {
  payment: {
    createIntent(purchaseHistoryId: string, paymentData: IChargeCustomerPaymentParams): Promise<any>
    retrieveIntent(paymentMethodId: string): Promise<{authenticated: boolean, paymentIntent: any}>
    setupCustomerPaymentIntent(customerId: string): Promise<any>
  }
  productDetailsService: ProductDetailService
  userDetailsService: UserDetailsService
  createUserProductsService: CreateUserProductsService
  userProductDetailsService: UserProductDetailsService
}
interface _IPurchaseHistoryParams extends IPurchaseHistoryParams {
  keepCardDetails: boolean
}
export class PurchaseProductService {
  constructor(protected dependencies: IDependencies) {
  }
  /**
   * purchase product
   * @param userId 
   * @param purchaseBody 
   */
  public purchaseOne = async (userId: string, purchaseBody: _IPurchaseHistoryParams) => {
    try {
      // check first if the product selected product is already brought by user/customer
      const purchasedProduct = await this.dependencies.userProductDetailsService.getOne(userId, purchaseBody.productId)
      if (purchasedProduct) {
        throw new Error('Failed to purchase this product. Product already purchased by this user.')
      }
      // fetch user data.
      const user = await this.dependencies.userDetailsService.findOne(userId)
      // fetch product data.
      const product = await this.dependencies.productDetailsService
        .findOne(purchaseBody.productId)
      // initialize purchase entity to run the business rules
      const newPurchaseHistory = new PurchaseHistoryEntity({
        amount: Number((product.price - (product.price * (product.discountPercentage / 100))).toFixed(2)),
        price: product.price,
        discountPercentage: product.discountPercentage,
        productId: purchaseBody.productId,
        userId: user._id,
        title: product.title,
        name: product.name,
        description: product.description,
        contentZip: product.contentZip,
        previewImage: product.previewImage,
        previewVideo: product.previewVideo,
        thumbnail: product.thumbnail,
        state: PURCHASE_HISTORY_STATE.PENDING,
      })
      let intentSecret = <any>null
      // if keepCardDetails is true, then create a card setup intent
      if (purchaseBody.keepCardDetails) {
        intentSecret = await this.dependencies.payment.setupCustomerPaymentIntent(user.stripeCustomerId)
      }
      // create intent customer and charge the customer.
      let paymentIntent = await this.dependencies.payment.createIntent(newPurchaseHistory._id, {
        amount: newPurchaseHistory.amount,
        customerId: user.stripeCustomerId,
        user
      })
      newPurchaseHistory.paymentIntentId = paymentIntent.id
      // insert it thru the repo.
      await this.dependencies.repositoryGateway.insertOne(newPurchaseHistory)
      // add some logs
      return {
        payment: paymentIntent,
        intentSecret
      }
    } catch (error) {
      console.log('failed to purchase the product. \nError :>> ', error);
      throw error
    }
  }
}