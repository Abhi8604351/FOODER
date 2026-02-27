const Food = require('../models/foodModel');
const AppError = require('../utils/appError');

class FoodService {
    async getFoods(query) {
        const {
            page = 1,
            limit = 10,
            category,
            search,
            minPrice,
            maxPrice,
            sort
        } = query;

        const filter = {};

        if (category && category !== 'All') filter.category = category;
        if (search) filter.name = { $regex: search, $options: 'i' };
        if (minPrice || maxPrice) {
            filter.price = {};
            if (minPrice) filter.price.$gte = Number(minPrice);
            if (maxPrice) filter.price.$lte = Number(maxPrice);
        }

        const totalFoods = await Food.countDocuments(filter);
        const totalPages = Math.ceil(totalFoods / limit);

        let dbQuery = Food.find(filter)
            .limit(limit * 1)
            .skip((page - 1) * limit);

        if (sort) {
            const sortBy = sort.split(',').join(' ');
            dbQuery = dbQuery.sort(sortBy);
        } else {
            dbQuery = dbQuery.sort('-createdAt');
        }

        const foods = await dbQuery;

        return {
            foods,
            pagination: {
                totalFoods,
                totalPages,
                currentPage: Number(page),
                limit: Number(limit)
            }
        };
    }

    async getFoodById(id) {
        const food = await Food.findById(id);
        if (!food) throw new AppError('Food item not found', 404);
        return food;
    }

    async createFood(foodData) {
        return await Food.create(foodData);
    }

    async updateFood(id, foodData) {
        const food = await Food.findById(id);
        if (!food) throw new AppError('Food item not found', 404);

        Object.assign(food, foodData);
        return await food.save();
    }

    async deleteFood(id) {
        const result = await Food.deleteOne({ _id: id });
        if (result.deletedCount === 0) throw new AppError('Food item not found', 404);
        return { message: 'Food item deleted successfully' };
    }

    async getCategories() {
        return await Food.distinct('category');
    }
}

module.exports = new FoodService();
