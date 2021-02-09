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
const title = faker.lorem.word()
const productObj = {
  name: title,
  title: title,
  description: faker.lorem.sentence(),
  price: Number(faker.finance.amount(1, 25)),
}
const request = supertest(App)
describe('@Create Product API', () => {
  it('should success creating product.', (done) => {
    request
      .post('/v1/products')
      .set('Authorization', `Bearer ${adminSignInResponse.token}`)
      .send(productObj)
      // .expect(httpStatus.CREATED)
      .then(({body}) => {
        const {success = false, result} = body
        assert.isOk(success)
        done()
      })
      .catch(done)
  })
  it('should failed creating product due to incorrect variable types for product title and name.', (done) => {
    request
      .post('/v1/products')
      .set('Authorization', `Bearer ${adminSignInResponse.token}`)
      .send({
        ...productObj,
        title: 123,
        name: 123,
      })
      .expect(httpStatus.BAD_REQUEST)
      .then(({body}) => {
        const {success = false, result} = body
        assert.isNotOk(success)
        done()
      })
      .catch(done)
  })
  it('should failed creating product due to incorrect variable types for product description.', (done) => {
    request
      .post('/v1/products')
      .set('Authorization', `Bearer ${adminSignInResponse.token}`)
      .send({
        ...productObj,
        description: 123
      })
      .expect(httpStatus.BAD_REQUEST)
      .then(({body}) => {
        const {success = false, result} = body
        assert.isNotOk(success)
        done()
      })
      .catch(done)
  })
  it('should failed creating product due to incorrect variable types for product price.', (done) => {
    request
      .post('/v1/products')
      .set('Authorization', `Bearer ${adminSignInResponse.token}`)
      .send({
        ...productObj,
        price: "x123"
      })
      .expect(httpStatus.BAD_REQUEST)
      .then(({body}) => {
        const {success = false, result} = body
        assert.isNotOk(success)
        done()
      })
      .catch(done)
  })
  it('should failed creating product due to incorrect negative value for product price.', (done) => {
    request
      .post('/v1/products')
      .set('Authorization', `Bearer ${adminSignInResponse.token}`)
      .send({
        ...productObj,
        price: -10
      })
      .expect(httpStatus.BAD_REQUEST)
      .then(({body}) => {
        const {success = false, result} = body
        assert.isNotOk(success)
        done()
      })
      .catch(done)
  })
})