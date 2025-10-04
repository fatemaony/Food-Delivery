import express from 'express';
import { createCheckoutSession, createOrder, getAllOrders, getMyOrders  } from '../controller/orderController.js';

const orderRouter = express.Router();

orderRouter.post('/create-checkout-session', createCheckoutSession);
orderRouter.post('/', createOrder);
orderRouter.get('/my-orders/:userId', getMyOrders);
orderRouter.get('/', getAllOrders);

export default orderRouter;
