import supertest from 'supertest'
import faker from 'faker'
import {v4 as uuid} from 'uuid'
import {expect} from 'chai'
import httpStatus from 'http-status'
/**
 * @main_app
 */
import App from '../../../../../index'
const request = supertest(App)
import {adminSignInResponse} from '../auth.test'
import {addedUsersResponse} from './create.test'
describe('@User List API', () => {
  it('should success fetch user details', (done) => {
    request
      .get(`/v1/users/${addedUsersResponse._id}`)
      .set('Authorization', `Bearer ${adminSignInResponse.token}`)
      .expect(httpStatus.OK)
      .then((response) => {
        const {success = false, result} = response.body
        expect(success).to.be.true
        expect(result._id).to.be.a('string')
        expect(result._id, 'result._id must not be empty.').to.not.be.eq('')
        expect(result.name).to.be.a('string')
        expect(result.name, 'result.name must not be empty.').to.not.be.eq('')
        expect(result.password, 'result.password must be undefined.').to.be.undefined
        done()
      })
      .catch(done)
  })
  it('should failed. Random userId', (done) => {
    request
      .get(`/v1/users/${uuid()}`)
      .set('Authorization', `Bearer ${adminSignInResponse.token}`)
      .expect(httpStatus.BAD_REQUEST)
      .then((response) => {
        const {success = false, result, errors} = response.body
        expect(success).to.be.false
        expect(errors).to.have.lengthOf(1)
        done()
      })
      .catch(done)
  })
})