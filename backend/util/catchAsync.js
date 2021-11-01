const AppError = require('./appError');

const catchAsync = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch((err) => next(new AppError(err.message, 404)));
  };
};

module.exports = catchAsync;
