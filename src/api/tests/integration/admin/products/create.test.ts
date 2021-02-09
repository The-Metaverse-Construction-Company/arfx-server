/**
 * @lib/frameworks
 */
import supertest from 'supertest'
import {assert} from 'chai'
import httpStatus from 'http-status'
import faker from 'faker'
import path from 'path'
/**
 * @main_app
 */
import App from '../../../../../index'
/**
 * @tester
 */
import {adminSignInResponse} from '../auth.test'
const title = faker.lorem.word(4)
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
      .attach('contentZip', path.join(__dirname, '../../../../../../test/products/contentzip.zip'))
      .attach('previewImage', path.join(__dirname, '../../../../../../test/products/preview-image.png'))
      .attach('previewVideo', path.join(__dirname, '../../../../../../test/products/preview-video.mp4'))
      .field('name', title)
      .field('title', title)
      .field('description', faker.lorem.sentence())
      .field('price', Number(faker.finance.amount(1, 25)))
      .expect(httpStatus.CREATED)
      .then(({body}) => {
        const {success = false, result, errors} = body
        assert.isOk(success)
        done()
      })
      .catch(done)
  })
  it('should failed creating product due to incorrect variable types for product title and name.', (done) => {
    request
      .post('/v1/products')
      .set('Authorization', `Bearer ${adminSignInResponse.token}`)
      .attach('contentZip', path.join(__dirname, '../../../../../../test/products/contentzip.zip'))
      .attach('previewImage', path.join(__dirname, '../../../../../../test/products/preview-image.png'))
      .attach('previewVideo', path.join(__dirname, '../../../../../../test/products/preview-video.mp4'))
      .field('name', 123)
      .field('title', 123)
      .field('description', faker.lorem.sentence())
      .field('price', Number(faker.finance.amount(1, 25)))
      .expect(httpStatus.BAD_REQUEST)
      .then(({body}) => {
        const {success = false, result, errors} = body
        assert.isNotOk(success)
        done()
      })
      .catch(done)
  })
  it('should failed creating product due to incorrect variable types for product description.', (done) => {
    request
      .post('/v1/products')
      .set('Authorization', `Bearer ${adminSignInResponse.token}`)
      .attach('contentZip', path.join(__dirname, '../../../../../../test/products/contentzip.zip'))
      .attach('previewImage', path.join(__dirname, '../../../../../../test/products/preview-image.png'))
      .attach('previewVideo', path.join(__dirname, '../../../../../../test/products/preview-video.mp4'))
      .field('name', title)
      .field('title', title)
      .field('description', 123)
      .field('price', Number(faker.finance.amount(1, 25)))
      .expect(httpStatus.BAD_REQUEST)
      .then(({body}) => {
        const {success = false, result, errors} = body
        assert.isNotOk(success)
        done()
      })
      .catch(done)
  })
  it('should failed creating product due to incorrect variable types for product price.', (done) => {
    request
      .post('/v1/products')
      .set('Authorization', `Bearer ${adminSignInResponse.token}`)
      .attach('contentZip', path.join(__dirname, '../../../../../../test/products/contentzip.zip'))
      .attach('previewImage', path.join(__dirname, '../../../../../../test/products/preview-image.png'))
      .attach('previewVideo', path.join(__dirname, '../../../../../../test/products/preview-video.mp4'))
      .field('name', title)
      .field('title', title)
      .field('description', faker.lorem.sentence())
      .field('price', 'x12')
      .expect(httpStatus.BAD_REQUEST)
      .then(({body}) => {
        const {success = false, result, errors} = body
        assert.isNotOk(success)
        done()
      })
      .catch(done)
  })
  it('should failed creating product due to incorrect negative value for product price.', (done) => {
    request
      .post('/v1/products')
      .set('Authorization', `Bearer ${adminSignInResponse.token}`)
      .attach('contentZip', path.join(__dirname, '../../../../../../test/products/contentzip.zip'))
      .attach('previewImage', path.join(__dirname, '../../../../../../test/products/preview-image.png'))
      .attach('previewVideo', path.join(__dirname, '../../../../../../test/products/preview-video.mp4'))
      .field('name', title)
      .field('title', title)
      .field('description', faker.lorem.sentence())
      .field('price', -15)
      .expect(httpStatus.BAD_REQUEST)
      .then(({body}) => {
        const {success = false, result, errors} = body
        assert.isNotOk(success)
        done()
      })
      .catch(done)
  })
})