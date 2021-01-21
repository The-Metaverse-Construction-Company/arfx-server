import Stripe from 'stripe'
import {RedisClient} from 'redis'
import {
  UserSignUp,
  VerifyUser,
  VerifyToken
} from '../domain/services/sign-up'
import {
  sendVerificationEmail
} from './email'
import {
  validateUserEmail,
  userDetails,
  userVerifyToken
} from './users'

import {
  UserRepository
} from '../../app-plugins/persistence/repository'

import AuthToken from '../helper/user-token'
// initiate Stripe API
const StripeSecretKey = process.env.STRIPE_SECRET_KEY as string
const stripe = new Stripe(StripeSecretKey, {typescript: true, apiVersion: "2020-08-27"})

export const userSignUp = (redis: RedisClient) => (
  new UserSignUp({
    repositoryGateway: new UserRepository(),
    generateToken: (new AuthToken({redisClient: redis})).generateAccessToken,
    sendEmail: sendVerificationEmail().sendOne,
    validateEmail: validateUserEmail().validateOne
  })
)
export const verifyUser = (redis: RedisClient) => {
  const authToken = new AuthToken({redisClient: redis})
  return new VerifyUser({
    revokeToken: authToken.removeAccessToken,
    repositoryGateway: new UserRepository(),
    userDetails: userDetails(),
    createStripeCustomer: async ({email,name}) => {
      try {
        const newCustomer = await stripe.customers.create({
          email,
          name
        })
        return newCustomer.id
      } catch (error) {
        console.log('Failed to create stripe customer. Error: ', error.message);
        throw error
      }
    }
  })
}
export const verifySignUpToken = (redis: RedisClient) => {
  return new VerifyToken({
    verifyUserToken: userVerifyToken(redis)
  })
}