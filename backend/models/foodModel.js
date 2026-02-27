const mongoose = require('mongoose');

const foodSchema = mongoose.Schema(
    {
        name: { type: String, required: true },
        description: { type: String, required: true },
        price: { type: Number, required: true, default: 0 },
        image: { type: String, required: true },
        category: { type: String, required: true },
        isAvailable: { type: Boolean, default: true },
        countInStock: { type: Number, default: 0 },
        isVeg: { type: Boolean, default: true },
    },
    { timestamps: true }
);

// Performance Indexes
foodSchema.index({ name: 'text', category: 1 });
foodSchema.index({ price: 1 });

const Food = mongoose.model('Food', foodSchema);
module.exports = Food;
