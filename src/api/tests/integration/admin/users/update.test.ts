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
import {addedUsersResponse} from './create.test'
import { ALLOWED_USER_ROLES } from '../../../../domain/entities/users'
const request = supertest(App)

const userObj = {
  name: faker.name.findName(),
  email: faker.internet.email(),
  role: 'user'
}

describe('@Update Users API', () => {
  it('should success updating Users', (done) => {
    request
      .patch(`/v1/users/${addedUsersResponse._id}`)
      .set('Authorization', `Bearer ${adminSignInResponse.token}`)
      .send(userObj)
      .expect(httpStatus.ACCEPTED)
      .then(({body}) => {
        const {success = false, result, errors} = body
        assert.isTrue(success)
        assert.isString(result._id)
        assert.isNotEmpty(result._id)
        assert.isString(result.name)
        assert.isNotEmpty(result.name)
        assert.isString(result.email.value)
        assert.isNotEmpty(result.email.value)
        assert.isString(result.role)
        assert.isNotEmpty(result.role)
        // check if role is on allowed users.
        assert.match(result.role, new RegExp(`^(${ALLOWED_USER_ROLES.join('|')})$`, 'i'))
        done()
      })
      .catch(done)
  })
  it('should failed updating Users. invalid email', (done) => {
    request
      .patch(`/v1/users/${addedUsersResponse._id}`)
      .set('Authorization', `Bearer ${adminSignInResponse.token}`)
      .send({
        ...userObj,
        email: 'invalid@qwe@try.com'
      })
      .expect(httpStatus.BAD_REQUEST)
      .then(({body}) => {
        const {success = false, result, errors} = body
        assert.isFalse(success)
        done()
      })
      .catch(done)
  })
  it('should failed updating Users. invalid user id', (done) => {
    request
      .patch(`/v1/users/${uuid()}`)
      .set('Authorization', `Bearer ${adminSignInResponse.token}`)
      .send(userObj)
      .expect(httpStatus.BAD_REQUEST)
      .then(({body}) => {
        const {success = false, result, errors} = body
        assert.isFalse(success)
        done()
      })
      .catch(done)
  })
})