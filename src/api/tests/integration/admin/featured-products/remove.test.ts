/**
 * @lib/frameworks
 */
import supertest from 'supertest'
import {assert} from 'chai'
import httpStatus from 'http-status'
import {v4 as uuid} from 'uuid'
/**
 * @main_app
 */
import App from '../../../../../index'
/**
 * @tester
 */
import {adminSignInResponse} from '../auth.test'
import {addedFeaturedProductResponse} from './create.test'
const request = supertest(App)


describe('@Update Featured Product API', () => {
  it('should success removing featured product.', (done) => {
    request
      .delete(`/v1/featured-products/${addedFeaturedProductResponse._id}`)
      .set('Authorization', `Bearer ${adminSignInResponse.token}`)
      .expect(httpStatus.ACCEPTED)
      .then(({body}) => {
        const {success = false, result, errors} = body
        assert.isOk(success)
        assert.isString(result._id)
        done()
      })
      .catch(done)
  })
  it('should failed removing featured product. removing same featuredProductId', (done) => {
    request
      .delete(`/v1/featured-products/${addedFeaturedProductResponse._id}`)
      .set('Authorization', `Bearer ${adminSignInResponse.token}`)
      .expect(httpStatus.BAD_REQUEST)
      .then(({body}) => {
        const {success = false, result, errors} = body
        assert.isFalse(success)
        done()
      })
      .catch(done)
  })
  it('should failed updating featured product. invalid featured product id', (done) => {
    request
      .delete(`/v1/featured-products/${uuid()}`)
      .set('Authorization', `Bearer ${adminSignInResponse.token}`)
      .expect(httpStatus.BAD_REQUEST)
      .then(({body}) => {
        const {success = false, result, errors} = body
        assert.isFalse(success)
        done()
      })
      .catch(done)
  })
})