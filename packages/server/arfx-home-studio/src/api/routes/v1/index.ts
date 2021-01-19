import express, {Request, Response} from 'express'
import userRoutes from './user.route'
import authRoutes from './auth.route'

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

export default router
