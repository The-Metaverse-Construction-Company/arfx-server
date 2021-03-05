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
import {addedProductResponse} from '../products/create.test'
import {addedFeaturedProductResponse} from './create.test'
const request = supertest(App)


describe('@Update Featured Product API', () => {
  it('should success updating featured product.', (done) => {
    request
      .patch(`/v1/featured-products/${addedFeaturedProductResponse._id}`)
      .set('Authorization', `Bearer ${adminSignInResponse.token}`)
      .send({
        productId: addedProductResponse._id,
        indexNo: 0
      })
      .expect(httpStatus.ACCEPTED)
      .then(({body}) => {
        const {success = false, result, errors} = body
        assert.isOk(success)
        assert.isString(result._id)
        done()
      })
      .catch(done)
  })
  it('should success updating featured product. with different indexNo', (done) => {
    request
      .patch(`/v1/featured-products/${addedFeaturedProductResponse._id}`)
      .set('Authorization', `Bearer ${adminSignInResponse.token}`)
      .send({
        productId: addedProductResponse._id,
        indexNo: 1
      })
      .expect(httpStatus.ACCEPTED)
      .then(({body}) => {
        const {success = false, result, errors} = body
        assert.isOk(success)
        done()
      })
      .catch(done)
  })
  it('should failed updating featured product. invalid featured product id', (done) => {
    request
      .patch(`/v1/featured-products/${uuid()}`)
      .set('Authorization', `Bearer ${adminSignInResponse.token}`)
      .send({
        productId: addedProductResponse._id,
        indexNo: 1
      })
      .expect(httpStatus.BAD_REQUEST)
      .then(({body}) => {
        const {success = false, result, errors} = body
        assert.isFalse(success)
        done()
      })
      .catch(done)
  })
  it('should failed updating featured product. invalid product id', (done) => {
    request
      .patch(`/v1/featured-products/${uuid()}`)
      .set('Authorization', `Bearer ${adminSignInResponse.token}`)
      .send({
        productId: uuid(),
        indexNo: 1
      })
      .expect(httpStatus.BAD_REQUEST)
      .then(({body}) => {
        const {success = false, result, errors} = body
        assert.isFalse(success)
        done()
      })
      .catch(done)
  })
})