import {
  IPurchaseHistoryBody,
  IPurchaseHistorryRepositoryGateway, IPurchaseHistoryParams
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
  CreateUserProductsService
} from '../user-products'
import { IGeneralServiceDependencies } from '../../interfaces';
import { IUserEntity } from '../../entities/users';
export interface IChargeCustomerPaymentParams {
  customerId: string, paymentMethodId: string, amount: number
}
interface IDependencies extends IGeneralServiceDependencies<IPurchaseHistorryRepositoryGateway> {
  payment: {
    chargeCustomer(paymentData: IChargeCustomerPaymentParams): Promise<{authenticated: boolean, paymentIntent: any}>
    setupCustomerPaymentIntent(customerId: string): Promise<any>
  }
  productDetailsService: ProductDetails
  userDetailsService: UserDetailsService
  createUserProductsService: CreateUserProductsService
}
export class PurchaseProductService {
  constructor(protected dependencies: IDependencies) {
  }
  /**
   * create purchase history
   * @param productBody 
   */
  public purchaseOne = async (userId: string, purchaseBody: IPurchaseHistoryParams) => {
    try {
      console.log('purchaseBody :>> ', purchaseBody);
      // fetch user data.
      const user = await this.dependencies.userDetailsService.findOne(userId)
      // fetch product data.
      const product = await this.dependencies.productDetailsService.findOne(purchaseBody.productId)
      // initialize purchase entity
      const newPurchaseHistory = new PurchaseHistoryEntity({
        ...purchaseBody,
        amount: product.price,
        paymentMethodId: purchaseBody.paymentMethodId,
        userId: user._id,
      })
      
      let intentSecret = <any>null
      // if keepCardDetails is true, then create a card setup intent
      if (purchaseBody.keepCardDetails) {
        intentSecret = await this.dependencies.payment.setupCustomerPaymentIntent(user.stripeCustomerId)
      }
      console.log('newPurchaseHistory :>> ', newPurchaseHistory);
      // charge customer,
      const {authenticated, paymentIntent} = await this.dependencies.payment.chargeCustomer({
        amount: newPurchaseHistory.amount,
        customerId: user.stripeCustomerId,
        paymentMethodId: newPurchaseHistory.paymentMethodId
      })
      newPurchaseHistory.paymentIntentId = paymentIntent.id
      // newPurchaseHistory
      // insert it thru the repo.
      await this.dependencies.repositoryGateway.insertOne(newPurchaseHistory)
      // insert the product details on the user products
      await this.dependencies.createUserProductsService.createOne({
        description: product.description,
        name: product.name,
        productId: product._id,
        productURL: product.productURL,
        title: product.title,
        userId: user._id
      })
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