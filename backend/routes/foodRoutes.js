const express = require('express');
const router = express.Router();
const {
    getFoods,
    getFoodById,
    createFood,
    updateFood,
    deleteFood,
    getCategories
} = require('../controllers/foodController');
const { protect, admin } = require('../middlewares/authMiddleware');

router.route('/').get(getFoods).post(protect, admin, createFood);
router.get('/categories', getCategories);
router
    .route('/:id')
    .get(getFoodById)
    .put(protect, admin, updateFood)
    .delete(protect, admin, deleteFood);

module.exports = router;
