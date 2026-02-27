const asyncHandler = require('../utils/asyncHandler');
const sendResponse = require('../utils/sendResponse');
const orderService = require('../services/orderService');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const addOrderItems = asyncHandler(async (req, res) => {
    const data = await orderService.createOrder(req.body, req.user._id);
    sendResponse(res, 201, data, 'Order created successfully');
});

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = asyncHandler(async (req, res) => {
    const data = await orderService.getOrderById(req.params.id);
    sendResponse(res, 200, data);
});

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = asyncHandler(async (req, res) => {
    const data = await orderService.getMyOrders(req.user._id);
    sendResponse(res, 200, data);
});

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = asyncHandler(async (req, res) => {
    const data = await orderService.getAllOrders();
    sendResponse(res, 200, data);
});

// @desc    Update order to delivered
// @route   PUT /api/orders/:id/deliver
// @access  Private/Admin
const updateOrderToStatus = asyncHandler(async (req, res) => {
    const { status } = req.body; // Status can be passed from frontend
    const data = await orderService.updateOrderStatus(req.params.id, status || 'Delivered');
    sendResponse(res, 200, data, `Order status updated to ${status || 'Delivered'}`);
});

// @desc    Get Admin dashboard stats
// @route   GET /api/orders/stats
// @access  Private/Admin
const getStats = asyncHandler(async (req, res) => {
    const data = await orderService.getAdminStats();
    sendResponse(res, 200, data);
});

module.exports = {
    addOrderItems,
    getOrderById,
    getMyOrders,
    getOrders,
    updateOrderToStatus,
    getStats
};
