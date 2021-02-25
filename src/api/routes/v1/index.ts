import express, {Request, Response} from 'express'
import userRoutes from './user.route'
import authRoutes from './auth.route'
import ResetPasswordRoute from './reset-password.route'
import SignUpRoute from './sign-up.route'
import ProductsRoute from './products.route'
import PaymentGatewayRoute from './payment-gateway.route'
import AdminAccountsRoute from './admin-accounts.route'
import FeaturedProductRoute from './featured-products.route'
import ReleasedVersionRoute from './released-version.route'
const router = express.Router();


/**
 * GET v1/status
 */
router.get('/status', (req: Request, res: Response) => res.send('OK'));
 
/**
 * @expose_routes
 */
router.use('/payment-gateway', PaymentGatewayRoute)
router.use('/electron-released-version', ReleasedVersionRoute);
router.use('/admin-accounts', AdminAccountsRoute);
router.use('/users', userRoutes);
router.use('/products', ProductsRoute);
router.use('/featured-products', FeaturedProductRoute);
router.use('/auth', authRoutes);
router.use('/auth/sign-up', SignUpRoute);
router.use('/auth/reset-password', ResetPasswordRoute);

export default router
