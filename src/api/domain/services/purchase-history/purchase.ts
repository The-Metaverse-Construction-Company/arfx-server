import {
  IPurchaseHistoryBody,
  IPurchaseHistorryRepositoryGateway, IPurchaseHistoryParams, PURCHASE_HISTORY_STATE
} from '../../entities/purchase-history'
import {
  PurchaseHistoryEntity
} from '../../entities'
import {
  ProductDetails
} from '../products'
import {
  UserDetailsService
} from '../users'
import {
  CreateUserProductsService,
  UserProductDetailsService
} from '../user-products'
import { IGeneralServiceDependencies } from '../../interfaces';
import { IUserEntity } from '../../entities/users';
export interface IChargeCustomerPaymentParams {
  customerId: string,
  // paymentMethodId: string,
  amount: number
}
interface IDependencies extends IGeneralServiceDependencies<IPurchaseHistorryRepositoryGateway> {
  payment: {
    createIntent(purchaseHistoryId: string, paymentData: IChargeCustomerPaymentParams): Promise<{authenticated: boolean, paymentIntent: any}>
    retrieveIntent(paymentMethodId: string): Promise<{authenticated: boolean, paymentIntent: any}>
    setupCustomerPaymentIntent(customerId: string): Promise<any>
  }
  productDetailsService: ProductDetails
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
   * create purchase history
   * @param productBody 
   */
  public purchaseOne = async (userId: string, purchaseBody: _IPurchaseHistoryParams) => {
    try {
      console.log('======================================================================================================================================');
      // check first if the product selected product is already brought by user/customer
      // const purchasedProduct = await this.dependencies.userProductDetailsService.getOne(userId, purchaseBody.productId)
      // if (purchasedProduct) {
      //   throw new Error('Failed to purchase this product. Product already purchased by this user.')
      // }
      // fetch user data.
      const user = await this.dependencies.userDetailsService.findOne(userId)
      // fetch product data.
      const product = await this.dependencies.productDetailsService.findOne(purchaseBody.productId)
      // initialize purchase entity
      const newPurchaseHistory = new PurchaseHistoryEntity({
        // ...purchaseBody,
        productId: purchaseBody.productId,
        paymentMethodId: purchaseBody.paymentMethodId,
        amount: product.price,
        price: product.price,
        discountPercentage: product.discountPercentage,
        userId: user._id,
        title: product.title,
        name: product.name,
        description: product.description,
        contentZip: product.contentZip,
        previewImage: product.previewImage,
        previewVideo: product.previewVideo,
        state: PURCHASE_HISTORY_STATE.PENDING,
      })
      
      let intentSecret = <any>null
      // if keepCardDetails is true, then create a card setup intent
      if (purchaseBody.keepCardDetails) {
        intentSecret = await this.dependencies.payment.setupCustomerPaymentIntent(user.stripeCustomerId)
      }
      // create intent customer and charge the customer.
      let {authenticated, paymentIntent} = await this.dependencies.payment.createIntent(newPurchaseHistory._id, {
        amount: newPurchaseHistory.amount,
        customerId: user.stripeCustomerId
      }).catch((err) => {
        return {
          authenticated: false,
          paymentIntent: err.raw.payment_intent
        }
      })
      newPurchaseHistory.paymentIntentId = paymentIntent.id
      await this.dependencies.repositoryGateway.insertOne(newPurchaseHistory)
      // insert it thru the repo.
      // insert the product details on the user products
      // add logs
      return {
        authenticated: authenticated,
        payment: paymentIntent,
        purchaseDetails: newPurchaseHistory,
        intentSecret
      }
    } catch (error) {
      console.log('failed to create product. \nError :>> ', error);
      throw error
    }
  }
}