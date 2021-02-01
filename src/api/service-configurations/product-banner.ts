/**
 * @libaries
 */
import {RedisClient} from 'redis'
/**
 * @services
 */
import {
  CreateProductBannerService,
  ProductBannerListService,
  RemoveProductBannerService,
  UpdateProductBannerService
} from '../domain/services/product-banner'
/**
 * @repositories
 */
import {
  ProductBannerRepository
} from '../../app-plugins/persistence/repository'

export const createProductBannerService = () => (
  new CreateProductBannerService({
    repositoryGateway: new ProductBannerRepository(),
  })
)
export const productBannerListService = () => (
  new ProductBannerListService({
    repositoryGateway: new ProductBannerRepository(),
  })
)
export const removeProductBannerService = () => (
  new RemoveProductBannerService({
    repositoryGateway: new ProductBannerRepository(),
  })
)
export const updateProductBannerService = () => (
  new UpdateProductBannerService({
    repositoryGateway: new ProductBannerRepository(),
  })
)
