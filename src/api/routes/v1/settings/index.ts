import express, {Request, Response} from 'express'
import { authorize, LOGGED_USER } from '../../../middlewares/auth';
import PaymentCardRoute from './payment-card.route'

import * as UserSettingRoute from '../../../controllers/user-settings/index.controller'
const router = express.Router({mergeParams: true});

router.use('/payment-card', 
  authorize(LOGGED_USER),
  PaymentCardRoute)
router.post('/password', 
  authorize(LOGGED_USER),
  UserSettingRoute.userChangePasswordRoute)

export default router;
