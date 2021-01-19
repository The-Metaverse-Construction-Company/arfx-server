import express, {Request, Response} from 'express'
import userRoutes from './user.route'
import authRoutes from './auth.route'
import ResetPasswordRoute from './reset-password.route'
import SignUpRoute from './sign-up.route'

const router = express.Router();

/**
 * GET v1/status
 */
router.get('/status', (req: Request, res: Response) => res.send('OK'));

/**
 * GET v1/docs
 */
router.use('/docs', express.static('docs'));

router.use('/users', userRoutes);
router.use('/auth', authRoutes);
router.use('/auth/sign-up', SignUpRoute);
router.use('/auth/reset-password', ResetPasswordRoute);

export default router
