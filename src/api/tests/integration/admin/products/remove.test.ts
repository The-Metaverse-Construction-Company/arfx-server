/**
 * @lib/frameworks
 */
import supertest from 'supertest'
import {assert} from 'chai'
import httpStatus from 'http-status'
import faker from 'faker'
import {v4 as uuid} from 'uuid'
/**
 * @main_app
 */
import App from '../../../../../index'
/**
 * @tester
 */
import {adminSignInResponse} from '../auth.test'
import {addedProductResponseToDelete} from './create.test'
const request = supertest(App)
describe('@Remove Product API', () => {
  it('should success remove product.', (done) => {
    request
      .delete(`/v1/products/${addedProductResponseToDelete._id}`)
      .set('Authorization', `Bearer ${adminSignInResponse.token}`)
      .expect(httpStatus.ACCEPTED)
      .then(({body}) => {
        const {success = false, result, errors} = body
        assert.isOk(success)
        done()
      })
      .catch(done)
  })
  it('should failed removing product again.', (done) => {
    request
      .delete(`/v1/products/${addedProductResponseToDelete._id}`)
      .set('Authorization', `Bearer ${adminSignInResponse.token}`)
      .expect(httpStatus.BAD_REQUEST)
      .then(({body}) => {
        const {success = false, result, errors} = body
        assert.isNotOk(success)
        assert.isAbove(errors.length, 0, 'errors must not be empty array.')
        done()
      })
      .catch(done)
  })
  it('should failed removing product due to non existing product id', (done) => {
    request
      .delete(`/v1/products/${uuid()}`)
      .set('Authorization', `Bearer ${adminSignInResponse.token}`)
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