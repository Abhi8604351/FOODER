const Order = require('../models/orderModel');
const AppError = require('../utils/appError');

class OrderService {
    async createOrder(orderData, userId) {
        if (orderData.orderItems && orderData.orderItems.length === 0) {
            throw new AppError('No order items', 400);
        }

        const Food = require('../models/foodModel');

        // Check stock and decrement
        for (const item of orderData.orderItems) {
            const food = await Food.findById(item.food);
            if (!food) throw new AppError(`Food item ${item.name} not found`, 404);
            if (food.countInStock < item.qty) {
                throw new AppError(`Insufficient stock for ${item.name}`, 400);
            }
            food.countInStock -= item.qty;
            if (food.countInStock === 0) food.isAvailable = false;
            await food.save();
        }

        const order = new Order({
            ...orderData,
            user: userId,
        });

        const savedOrder = await order.save();

        // Save address to user for next time
        if (orderData.shippingAddress) {
            const User = require('../models/userModel');
            await User.findByIdAndUpdate(userId, {
                address: orderData.shippingAddress.address,
                city: orderData.shippingAddress.city,
                postalCode: orderData.shippingAddress.postalCode,
                country: orderData.shippingAddress.country,
            });
        }

        return savedOrder;
    }

    async getOrderById(id) {
        const order = await Order.findById(id).populate('user', 'name email');
        if (!order) throw new AppError('Order not found', 404);
        return order;
    }

    async getMyOrders(userId) {
        return await Order.find({ user: userId }).sort('-createdAt');
    }

    async getAllOrders() {
        return await Order.find({}).populate('user', 'name email').sort('-createdAt');
    }

    async updateOrderStatus(id, status) {
        const order = await Order.findById(id);
        if (!order) throw new AppError('Order not found', 404);

        order.status = status;
        if (status === 'Delivered') {
            order.isDelivered = true;
            order.deliveredAt = Date.now();
        }

        return await order.save();
    }

    async getAdminStats() {
        const orders = await Order.find({});

        const totalOrders = orders.length;
        const totalRevenue = orders.reduce((acc, o) => acc + o.totalPrice, 0);
        const pendingOrders = orders.filter(o => !o.isDelivered).length;
        const deliveredOrders = totalOrders - pendingOrders;

        // Monthly revenue logic (Simplified)
        const statsByMonth = await Order.aggregate([
            {
                $group: {
                    _id: { $month: "$createdAt" },
                    revenue: { $sum: "$totalPrice" },
                    count: { $sum: 1 }
                }
            },
            { $sort: { "_id": 1 } }
        ]);

        return {
            totalOrders,
            totalRevenue,
            pendingOrders,
            deliveredOrders,
            statsByMonth
        };
    }
}

module.exports = new OrderService();
