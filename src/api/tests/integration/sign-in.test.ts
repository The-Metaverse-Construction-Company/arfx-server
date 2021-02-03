import supertest from 'supertest'
import {assert} from 'chai'

import App from '../../../index'
const request = supertest(App)

describe('@SignIn API', () => {
  request
    .post('/v1/auth/sign-in')
    .send()
})