const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || (res.statusCode >= 400 ? res.statusCode : 500);

  if (err.name === 'ValidationError') statusCode = 400;
  if (err.code === 11000) {
    statusCode = 409;
    err.message = `${Object.keys(err.keyValue || {})[0] || 'Value'} already exists`;
  }
  if (err.name === 'CastError') {
    statusCode = 404;
    err.message = 'Resource not found';
  }

  res.status(statusCode);

  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};

module.exports = { errorHandler };
