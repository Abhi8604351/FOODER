const express = require('express');
const router = express.Router();
const upload = require('../middlewares/uploadMiddleware');
const { protect, admin } = require('../middlewares/authMiddleware');
const sendResponse = require('../utils/sendResponse');

router.post('/', protect, admin, upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ status: 'error', message: 'No file uploaded' });
    }

    // Normalize path for web access
    const filePath = `/${req.file.path.replace(/\\/g, '/')}`;
    sendResponse(res, 200, filePath, 'Image uploaded successfully');
});

module.exports = router;
