const AppError = require('../utils/AppError');

function notFound(req, res, next) {
  next(new AppError('مسیر یافت نشد.', 404, 'NOT_FOUND'));
}

function errorHandler(err, req, res, next) { // eslint-disable-line no-unused-vars
  const statusCode = err.statusCode || 500;
  if (process.env.NODE_ENV !== 'production') console.error(err);
  res.status(statusCode).json({
    success: false,
    error: { code: err.code || 'ERROR', message: err.message || 'خطایی رخ داد.' },
  });
}

module.exports = { notFound, errorHandler };
