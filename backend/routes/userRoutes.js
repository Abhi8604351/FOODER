const express = require('express');
const router = express.Router();
const {
    authUser,
    registerUser,
    getUserProfile,
    updateUserProfile,
    forgotPassword,
    resetPassword,
    getUsers,
} = require('../controllers/userController');
const { protect, admin } = require('../middlewares/authMiddleware');

router.post('/', registerUser);
router.post('/login', authUser);
router.route('/profile').get(protect, getUserProfile).put(protect, updateUserProfile);
router.post('/forgotpassword', forgotPassword);
router.post('/resetpassword/:token', resetPassword);
router.get('/', protect, admin, getUsers);

module.exports = router;
