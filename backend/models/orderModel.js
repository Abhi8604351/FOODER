const mongoose = require('mongoose');

const orderSchema = mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
        orderItems: [
            {
                name: { type: String, required: true },
                qty: { type: Number, required: true },
                image: { type: String, required: true },
                price: { type: Number, required: true },
                food: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Food' },
            },
        ],
        shippingAddress: {
            address: { type: String, required: true },
            city: { type: String, required: true },
            postalCode: { type: String, required: true },
            country: { type: String, required: true },
        },
        paymentMethod: { type: String, required: true, default: 'Cash' },
        totalPrice: { type: Number, required: true, default: 0.0 },
        isPaid: { type: Boolean, required: true, default: false },
        paidAt: { type: Date },
        status: {
            type: String,
            required: true,
            default: 'Pending',
            enum: ['Pending', 'Preparing', 'Out for delivery', 'Delivered']
        },
        isDelivered: { type: Boolean, required: true, default: false },
        deliveredAt: { type: Date },
    },
    { timestamps: true }
);

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;
