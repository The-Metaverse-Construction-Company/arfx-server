import httpStatus from 'http-status'
import {
  Response, Request, NextFunction
} from 'express'
import {
  updateUserPasswordService,
  validateUserPasswordService
} from '../../service-configurations/users'
import { IUserEntity } from '../../domain/entities/users';
import { successReponse } from '../../helper/http-response';

export const userChangePasswordRoute = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {userId} = req.params
    const {_id = ''} = <IUserEntity>req.user
    const {password = '', newPassword = ''} = req.body
    // validate the old password first,
    const user = await validateUserPasswordService()
      .validateOne(userId, password)
    // then if validated, change/update the user password
    const updatedUser = await updateUserPasswordService()
      .updateOne(user._id, newPassword)
    res.status(httpStatus.ACCEPTED).send(successReponse(updatedUser))
    return
  } catch (error) {
    console.log('object :>> ', error);
    next(error)
  }
};
