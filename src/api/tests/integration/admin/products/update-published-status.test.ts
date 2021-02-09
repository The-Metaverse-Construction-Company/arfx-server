/**
 * @lib/frameworks
 */
import supertest from 'supertest'
import {assert} from 'chai'
import httpStatus from 'http-status'
import faker from 'faker'
/**
 * @main_app
 */
import App from '../../../../../index'
/**
 * @tester
 */
import {adminSignInResponse} from '../auth.test'
import {addedProductResponse} from './create.test'
const title = faker.lorem.word(4)
const request = supertest(App)
describe('@Update Product API', () => {
  it('should success, update product publish status', (done) => {
    request
      .patch(`/v1/products/${addedProductResponse._id}/published`)
      .set('Authorization', `Bearer ${adminSignInResponse.token}`)
      .send({
        status: true
      })
      .expect(httpStatus.ACCEPTED)
      .then(({body}) => {
        const {success = false, result, errors} = body
        assert.isOk(success)
        done()
      })
      .catch(done)
  })
  it('should failed, update product publish status as string', (done) => {
    request
      .patch(`/v1/products/${addedProductResponse._id}/published`)
      .set('Authorization', `Bearer ${adminSignInResponse.token}`)
      .send({
        status: "qwe"
      })
      .expect(httpStatus.BAD_REQUEST)
      .then(({body}) => {
        const {success = false, result, errors} = body
        assert.isNotOk(success)
        assert.isAbove(errors.length, 0, 'errors must not be empty array.')
        done()
      })
      .catch(done)
  })
  it('should failed, update product publish status as number', (done) => {
    request
      .patch(`/v1/products/${addedProductResponse._id}/published`)
      .set('Authorization', `Bearer ${adminSignInResponse.token}`)
      .send({
        status: 123
      })
      .expect(httpStatus.BAD_REQUEST)
      .then(({body}) => {
        const {success = false, result, errors} = body
        assert.isNotOk(success)
        assert.isAbove(errors.length, 0, 'errors must not be empty array.')
        done()
      })
      .catch(done)
  })
  it('should failed, update product publish status as number string', (done) => {
    request
      .patch(`/v1/products/${addedProductResponse._id}/published`)
      .set('Authorization', `Bearer ${adminSignInResponse.token}`)
      .send({
        status: "123"
      })
      .expect(httpStatus.BAD_REQUEST)
      .then(({body}) => {
        const {success = false, result, errors} = body
        assert.isNotOk(success)
        assert.isAbove(errors.length, 0, 'errors must not be empty array.')
        done()
      })
      .catch(done)
  })
})