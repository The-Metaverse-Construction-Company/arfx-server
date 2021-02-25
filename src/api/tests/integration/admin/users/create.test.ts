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
import { ALLOWED_USER_ROLES, IUserEntity } from '../../../../domain/entities/users'
export let addedUsersResponse = <IUserEntity>{}
const request = supertest(App)

const userObj = {
  name: faker.name.findName(),
  email: faker.internet.email(),
  password: "asdasd123123"
}

describe('@Create Users API', () => {
  it('should success creating Users.', (done) => {
    request
      .post('/v1/users')
      .set('Authorization', `Bearer ${adminSignInResponse.token}`)
      .send(userObj)
      .expect(httpStatus.CREATED)
      .then(({body}) => {
        const {success = false, result, errors} = body
        addedUsersResponse = result
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
  it('should failed creating Users. duplicate email', (done) => {
    request
      .post('/v1/users')
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
  it('should failed creating Users. invalid email', (done) => {
    request
      .post('/v1/users')
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
  it('should failed creating Users. invalid name', (done) => {
    request
      .post('/v1/users')
      .set('Authorization', `Bearer ${adminSignInResponse.token}`)
      .send({
        ...userObj,
        name: 'qwerty boyo12 jr.',
        email: faker.internet.email()
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