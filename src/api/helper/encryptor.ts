import bcrypt from 'bcryptjs'

export const hash = bcrypt.hashSync
export const compare = bcrypt.compareSync