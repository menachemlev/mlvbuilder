module.exports = (err, req, res, next) => {
  res.status(500).json({
    status: 'fail',
    message: `${err.isOperational ? err.message : 'Something went very wrong'}`,
  });
};
