const asyncHandler = require('../utils/asyncHandler');
const sendResponse = require('../utils/sendResponse');
const foodService = require('../services/foodService');

// @desc    Fetch all foods
// @route   GET /api/foods
// @access  Public
const getFoods = asyncHandler(async (req, res) => {
    const data = await foodService.getFoods(req.query);
    sendResponse(res, 200, data);
});

// @desc    Fetch single food
// @route   GET /api/foods/:id
// @access  Public
const getFoodById = asyncHandler(async (req, res) => {
    const data = await foodService.getFoodById(req.params.id);
    sendResponse(res, 200, data);
});

// @desc    Create a food
// @route   POST /api/foods
// @access  Private/Admin
const createFood = asyncHandler(async (req, res) => {
    const data = await foodService.createFood(req.body);
    sendResponse(res, 201, data, 'Food item created');
});

// @desc    Update a food
// @route   PUT /api/foods/:id
// @access  Private/Admin
const updateFood = asyncHandler(async (req, res) => {
    const data = await foodService.updateFood(req.params.id, req.body);
    sendResponse(res, 200, data, 'Food item updated');
});

// @desc    Delete a food
// @route   DELETE /api/foods/:id
// @access  Private/Admin
const deleteFood = asyncHandler(async (req, res) => {
    const data = await foodService.deleteFood(req.params.id);
    sendResponse(res, 200, data, 'Food item deleted');
});

// @desc    Get all categories
// @route   GET /api/foods/categories
// @access  Public
const getCategories = asyncHandler(async (req, res) => {
    const data = await foodService.getCategories();
    sendResponse(res, 200, data);
});

module.exports = { getFoods, getFoodById, createFood, updateFood, deleteFood, getCategories };
