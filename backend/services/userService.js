const User = require('../models/userModel');
const generateToken = require('../utils/generateToken');
const AppError = require('../utils/appError');

class UserService {
    async registerUser(userData) {
        const { name, email, password } = userData;
        const userExists = await User.findOne({ email });

        if (userExists) {
            throw new AppError('User already exists', 400);
        }

        const user = await User.create({ name, email, password });
        return this.formatUserResponse(user);
    }

    async loginUser(email, password) {
        const user = await User.findOne({ email });

        if (user && (await user.matchPassword(password))) {
            return this.formatUserResponse(user);
        } else {
            throw new AppError('Invalid email or password', 401);
        }
    }

    async getUserProfile(userId) {
        const user = await User.findById(userId);
        if (!user) throw new AppError('User not found', 404);
        return {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            address: user.address,
            city: user.city,
            postalCode: user.postalCode,
            country: user.country
        };
    }

    async updateUserProfile(userId, updateData) {
        const user = await User.findById(userId);
        if (!user) throw new AppError('User not found', 404);

        user.name = updateData.name || user.name;
        user.email = updateData.email || user.email;
        user.address = updateData.address || user.address;
        user.city = updateData.city || user.city;
        user.postalCode = updateData.postalCode || user.postalCode;
        user.country = updateData.country || user.country;

        if (updateData.password) {
            user.password = updateData.password;
        }

        const updatedUser = await user.save();
        return this.formatUserResponse(updatedUser);
    }

    async forgotPassword(email) {
        const user = await User.findOne({ email });
        if (!user) throw new AppError('User not found', 404);

        // Generate simple reset token (in prod use crypto)
        const resetToken = Math.random().toString(36).substring(7);
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpire = Date.now() + 3600000; // 1 hour

        await user.save();

        // In real app, send email. Here we just return it for demo purposes
        return resetToken;
    }

    async resetPassword(token, password) {
        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpire: { $gt: Date.now() }
        });

        if (!user) throw new AppError('Invalid or expired token', 400);

        user.password = password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save();
        return { message: 'Password reset successful' };
    }

    async getAllUsers() {
        return await User.find({}).select('-password');
    }

    formatUserResponse(user) {
        return {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            address: user.address,
            city: user.city,
            postalCode: user.postalCode,
            country: user.country,
            token: generateToken(user._id),
        };
    }
}

module.exports = new UserService();
