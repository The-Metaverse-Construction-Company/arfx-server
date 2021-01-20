import Joi from 'joi'
import {
  ALLOWED_USER_ROLE
} from '../domain/entities/users'
const allowed_roles = Object.values(ALLOWED_USER_ROLE)
// GET /v1/users
export const listUsers = {
  query: {
    page: Joi.number().min(1),
    perPage: Joi.number().min(1).max(100),
    name: Joi.string(),
    email: Joi.string(),
    role: Joi.string().valid(allowed_roles),
  },
}
// POST /v1/users
export const createUser = {
  body: {
    email: Joi.string().email().required(),
    password: Joi.string().min(6).max(128).required(),
    name: Joi.string().max(128),
    role: Joi.string().valid(allowed_roles),
  },
}
// PUT /v1/users/:userId
export const replaceUser = {
  body: {
    email: Joi.string().email().required(),
    password: Joi.string().min(6).max(128).required(),
    name: Joi.string().max(128),
    role: Joi.string().valid(allowed_roles),
  },
  params: {
    userId: Joi.string().regex(/^[a-fA-F0-9]{24}$/).required(),
  },
}
// PATCH /v1/users/:userId
export const updateUser = {
  body: {
    email: Joi.string().email(),
    password: Joi.string().min(6).max(128),
    name: Joi.string().max(128),
    role: Joi.string().valid(allowed_roles),
  },
  params: {
    userId: Joi.string().regex(/^[a-fA-F0-9]{24}$/).required(),
  },
}