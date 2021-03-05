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
describe('@User List API', () => {
  it('should success fetch user details', (done) => {
    request
      .get(`/v1/users`)
      .set('Authorization', `Bearer ${adminSignInResponse.token}`)
      .expect(httpStatus.OK)
      .then((response) => {
        const {success = false, result} = response.body
        expect(success).to.be.true
        expect(result.data).to.be.a('array')
        expect(result.data[0]._id).to.be.a('string')
        expect(result.data[0]._id).to.not.be.eq('', 'result.data[n]._id must not be empty.')
        expect(result.data[0].name).to.be.a('string')
        expect(result.data[0].name).to.not.be.eq('', 'result.data[n].name must not be empty.')
        expect(result.data[0].password).to.be.undefined
        done()
      })
      .catch(done)
  })
  it('should succeed. with pageNo and limit query params', (done) => {
    request
      .get(`/v1/users`)
      .set('Authorization', `Bearer ${adminSignInResponse.token}`)
      .query({
        pageNo: 1,
        limit: 20
      })
      .expect(httpStatus.OK)
      .then((response) => {
        const {success = false, result} = response.body
        expect(success).to.be.true
        expect(result.data).to.be.a('array')
        expect(result.data[0]._id).to.be.a('string')
        expect(result.data[0]._id).to.not.be.eq('', 'result.data[n]._id must not be empty.')
        expect(result.data[0].name).to.be.a('string')
        expect(result.data[0].name).to.not.be.eq('', 'result.data[n].name must not be empty.')
        expect(result.data[0].password).to.be.undefined
        done()
      })
      .catch(done)
  })
  it('should failed. query params pageNo string value', (done) => {
    request
      .get(`/v1/users`)
      .set('Authorization', `Bearer ${adminSignInResponse.token}`)
      .query({
        pageNo: "qwe",
        limit: 20
      })
      .expect(httpStatus.BAD_REQUEST)
      .then((response) => {
        const {success = false, result} = response.body
        expect(success).to.be.false
        done()
      })
      .catch(done)
  })
  it('should failed. query params limit string value', (done) => {
    request
      .get(`/v1/users`)
      .set('Authorization', `Bearer ${adminSignInResponse.token}`)
      .query({
        pageNo: 1,
        limit: "qwe"
      })
      .expect(httpStatus.BAD_REQUEST)
      .then((response) => {
        const {success = false, result} = response.body
        expect(success).to.be.false
        done()
      })
      .catch(done)
  })
  it('should failed. query params pageNo with negative value', (done) => {
    request
      .get(`/v1/users`)
      .set('Authorization', `Bearer ${adminSignInResponse.token}`)
      .query({
        pageNo: -3,
        limit: 10
      })
      .expect(httpStatus.BAD_REQUEST)
      .then((response) => {
        const {success = false, result} = response.body
        expect(success).to.be.false
        done()
      })
      .catch(done)
  })
  it('should failed. query params limit with negative value', (done) => {
    request
      .get(`/v1/users`)
      .set('Authorization', `Bearer ${adminSignInResponse.token}`)
      .query({
        pageNo: 1,
        limit: -10
      })
      .expect(httpStatus.BAD_REQUEST)
      .then((response) => {
        const {success = false, result} = response.body
        expect(success).to.be.false
        done()
      })
      .catch(done)
  })
})