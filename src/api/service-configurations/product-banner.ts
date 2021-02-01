/**
 * @libaries
 */
import {RedisClient} from 'redis'
/**
 * @services
 */
import {
  CreateFeaturedProductService,
  FeaturedProductListService,
  RemoveFeaturedProductService,
  UpdateFeaturedProductService
} from '../domain/services/featured-product'
/**
 * @repositories
 */
import {
  FeaturedProductRepository
} from '../../app-plugins/persistence/repository'

export const createFeaturedProductService = () => (
  new CreateFeaturedProductService({
    repositoryGateway: new FeaturedProductRepository(),
  })
)
export const featuredProductListService = () => (
  new FeaturedProductListService({
    repositoryGateway: new FeaturedProductRepository(),
  })
)
export const removeFeaturedProductService = () => (
  new RemoveFeaturedProductService({
    repositoryGateway: new FeaturedProductRepository(),
  })
)
export const updateFeaturedProductService = () => (
  new UpdateFeaturedProductService({
    repositoryGateway: new FeaturedProductRepository(),
  })
)
