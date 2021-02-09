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
const request = supertest(App)

const userObj = {
  name: faker.name.findName(),
  email: faker.internet.email(),
  role: 'user'
}

describe('@Suspend/Unsuspend Users API', () => {
  describe('@suspend user', () => {
    it('should success suspending user', (done) => {
      request
        .delete(`/v1/users/${addedUsersResponse._id}`)
        .set('Authorization', `Bearer ${adminSignInResponse.token}`)
        .expect(httpStatus.ACCEPTED)
        .then(({body}) => {
          const {success = false, result, errors} = body
          assert.isTrue(success)
          assert.isString(result._id)
          assert.isNotEmpty(result._id)
          done()
        })
        .catch(done)
    })
    it('should failed suspending user. invalid user id', (done) => {
      request
        .patch(`/v1/users/${uuid()}`)
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
  describe('@unsuspend user', () => {
    it('should success unsuspend user', (done) => {
      request
        .patch(`/v1/users/${addedUsersResponse._id}/unsuspend`)
        .set('Authorization', `Bearer ${adminSignInResponse.token}`)
        .expect(httpStatus.ACCEPTED)
        .then(({body}) => {
          const {success = false, result, errors} = body
          assert.isTrue(success)
          assert.isString(result._id)
          assert.isNotEmpty(result._id)
          done()
        })
        .catch(done)
    })
    it('should failed unsuspend user. invalid user id', (done) => {
      request
        .patch(`/v1/users/${uuid()}/unsuspend`)
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
})