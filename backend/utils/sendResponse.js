const sendResponse = (res, statusCode, data, message = 'Success') => {
    res.status(statusCode).json({
        status: 'success',
        message,
        results: Array.isArray(data) ? data.length : undefined,
        data,
    });
};

module.exports = sendResponse;
