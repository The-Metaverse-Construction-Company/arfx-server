import faker from 'faker'
import {expect} from 'chai'

import User, { ALLOWED_USER_ROLE, IUserEntity } from '../../../domain/entities/users'
import { validateEmailAddress } from '../../../helper'

export const UserEntity = User({
  generateId: () => "1",
  hash: () => faker.internet.password(25),
  validateEmail: validateEmailAddress
})

describe('@User Entity', () => {
  const userObject = <Partial<IUserEntity>>{
    email: {
      value: faker.internet.email(),
      verified: false,
      verifiedAt: 0
    },
    mobileNumber: {
      value: faker.phone.phoneNumber('+639#########'),
      verified: false,
      verifiedAt: 0
    },
    name: faker.name.findName(),
    role: ALLOWED_USER_ROLE.USER,
    stripeCustomerId: '',
    suspended: false  
  }
  it('should be success', () => {
    const newUser = new UserEntity(userObject)
    expect(newUser._id).to.be.a('string')
    expect(newUser.name).to.equal(userObject.name)
    expect(newUser.email.value).to.be.equal(userObject.email.value)
    expect(newUser.email.verified).to.be.a('boolean')
    expect(newUser.email.verified).to.be.equal(false)
    expect(newUser.email.verifiedAt).to.be.a('number')
    expect(newUser.email.verifiedAt).to.be.equal(0)
    expect(newUser.mobileNumber.value).to.be.equal(userObject.mobileNumber.value)
    expect(newUser.mobileNumber.verified).to.be.a('boolean')
    expect(newUser.mobileNumber.verified).to.be.equal(false)
    expect(newUser.mobileNumber.verifiedAt).to.be.a('number')
    expect(newUser.mobileNumber.verifiedAt).to.be.equal(0)
    expect(newUser.role).to.be.equal(userObject.role)
  })
  describe('@role property', () => {
    it('should succeed. admin role', () => {
      const newUser = new UserEntity({
        ...userObject,
        role: ALLOWED_USER_ROLE.ADMIN
      })
      expect(newUser.role).to.be.equal(ALLOWED_USER_ROLE.ADMIN)
    })
    it('should failed. invalid role', () => {
      try {
        const newUser = new UserEntity({
          ...userObject,
          role: 'superman'
        })
        expect.fail('should error. role: superman')
      } catch (error) {
        expect(error).not.to.be.null
      }
    })
  })
  describe('@email property', () => {
    it('should failed. invalid email format', () => {
      try {
        const newUser = new UserEntity({
          ...userObject,
          email: {
            value: 'qwety',
            verified: false,
            verifiedAt: 0
          }
        })
        expect.fail('should error. email.value: qwety')
      } catch (error) {
        expect(error).not.to.be.null
      }
    })
    it('should be failed. with white space', () => {
      try {
        const newUser = new UserEntity({
          ...userObject,
          email: {
            value: 'juan test@gmail.com',
            verified: false,
            verifiedAt: 0
          }
        })
        expect.fail('should error. email.value: "juan test@gmail.com"')
      } catch (error) {
        expect(error).not.to.be.null
      }
    })
    it('should be failed. double \'@\'', () => {
      try {
        const newUser = new UserEntity({
          ...userObject,
          email: {
            value: 'juan@test@gmail.com',
            verified: false,
            verifiedAt: 0
          }
        })
        expect.fail('should error. email.value: "juan@test@gmail.com"')
      } catch (error) {
        expect(error).not.to.be.null
      }
    })
    it('should be failed. added triple ".com"', () => {
      try {
        const newUser = new UserEntity({
          ...userObject,
          email: {
            value: 'juan@test@gmail.com.com.com.com',
            verified: false,
            verifiedAt: 0
          }
        })
        expect.fail('should error. email.value: "juan@test@gmail.com.com.com.com"')
      } catch (error) {
        expect(error).not.to.be.null
      }
    })
  })
  describe('@suspend property', () => {
    it('should success. suspend set to true', () => {
      const newUser = new UserEntity({
        ...userObject,
        suspended: true
      })
    })
    it('should success. suspend set to false', () => {
      const newUser = new UserEntity({
        ...userObject,
        suspended: false
      })
    })
    it('should failed. suspend set to random string', () => {
      try {
        const newUser = new UserEntity({
          ...userObject,
          //@ts-expect-error
          suspended: faker.internet.password(6)
        })
        expect.fail(`should error. suspended: "${faker.internet.password(6)}"`)
      } catch (error) {
        expect(error).not.to.be.null
      }
    })
  })
})