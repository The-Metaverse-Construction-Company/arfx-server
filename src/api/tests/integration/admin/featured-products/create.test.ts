/**
 * @lib/frameworks
 */
import supertest from 'supertest'
import {assert} from 'chai'
import httpStatus from 'http-status'
import {v4 as uuid} from 'uuid'

import Logger from '../../../../../config/logger'
/**
 * @main_app
 */
import App from '../../../../../index'
/**
 * @tester
 */
import {adminSignInResponse} from '../auth.test'
import {addedProductResponse} from '../products/create.test'
import { IFeaturedProductEntity } from '../../../../domain/entities/featured-product'
export let addedFeaturedProductResponse = <IFeaturedProductEntity>{}
const request = supertest(App)


describe('@Create Featured Product API', () => {
  it('should success creating featured product.', (done) => {
    request
      .post('/v1/featured-products')
      .set('Authorization', `Bearer ${adminSignInResponse.token}`)
      .send({
        productId: addedProductResponse._id,
        indexNo: 0
      })
      .expect(httpStatus.CREATED)
      .then(({body}) => {
        const {success = false, result, errors} = body
        addedFeaturedProductResponse = result
        assert.isOk(success)
        assert.isString(result._id)
        done()
      })
      .catch(done)
  })
  it('should success creating featured product. with different indexNo', (done) => {
    request
      .post('/v1/featured-products')
      .set('Authorization', `Bearer ${adminSignInResponse.token}`)
      .send({
        productId: addedProductResponse._id,
        indexNo: 1
      })
      .expect(httpStatus.CREATED)
      .then(({body}) => {
        const {success = false, result, errors} = body
        assert.isOk(success)
        done()
      })
      .catch(done)
  })
  it('should failed creating featured product. invalid product id', (done) => {
    request
      .post('/v1/featured-products')
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