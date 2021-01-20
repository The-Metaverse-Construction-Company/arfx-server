import express, {Request, Response} from 'express'
import { authorize, LOGGED_USER } from '../../../middlewares/auth';

import PaymentCardRoute from './payment-card.route'
const router = express.Router({mergeParams: true});

router.use('/payment-card', 
  authorize(LOGGED_USER),
  PaymentCardRoute)

export default router;
