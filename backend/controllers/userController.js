const asyncHandler = require('../utils/asyncHandler');
const sendResponse = require('../utils/sendResponse');
const userService = require('../services/userService');

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
const authUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const data = await userService.loginUser(email, password);
    sendResponse(res, 200, data, 'Login successful');
});

// @desc    Register a new user
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
    const data = await userService.registerUser(req.body);
    sendResponse(res, 201, data, 'Registration successful');
});

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
    const data = await userService.getUserProfile(req.user._id);
    sendResponse(res, 200, data);
});

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
    const data = await userService.updateUserProfile(req.user._id, req.body);
    sendResponse(res, 200, data, 'Profile updated successfully');
});

// @desc    Forgot password
// @route   POST /api/users/forgotpassword
// @access  Public
const forgotPassword = asyncHandler(async (req, res) => {
    const token = await userService.forgotPassword(req.body.email);
    sendResponse(res, 200, { token }, 'Reset token generated (Check console/logs)');
});

// @desc    Reset password
// @route   POST /api/users/resetpassword/:token
// @access  Public
const resetPassword = asyncHandler(async (req, res) => {
    const data = await userService.resetPassword(req.params.token, req.body.password);
    sendResponse(res, 200, data, 'Password reset successful');
});

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
const getUsers = asyncHandler(async (req, res) => {
    const data = await userService.getAllUsers();
    sendResponse(res, 200, data);
});

module.exports = {
    authUser,
    registerUser,
    getUserProfile,
    updateUserProfile,
    forgotPassword,
    resetPassword,
    getUsers
};
