const express = require('express');
const router = express.Router();
const {
    addOrderItems,
    getOrderById,
    getMyOrders,
    getOrders,
    updateOrderToStatus,
    getStats
} = require('../controllers/orderController');
const { protect, admin } = require('../middlewares/authMiddleware');

router.route('/').post(protect, addOrderItems).get(protect, admin, getOrders);
router.get('/myorders', protect, getMyOrders);
router.get('/stats', protect, admin, getStats);
router.route('/:id').get(protect, getOrderById);
router.route('/:id/deliver').put(protect, admin, updateOrderToStatus);
router.route('/:id/status').put(protect, admin, updateOrderToStatus);

module.exports = router;
