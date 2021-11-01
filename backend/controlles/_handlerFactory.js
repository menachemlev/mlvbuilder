const catchAsync = require('../util/catchAsync');

exports.deleteOne = (model, modelName) =>
  catchAsync(async (req, res, next) => {
    const doc = await model.findById(req.params.id);

    if (doc.email !== req.body.email) {
      return next(new AppError(`Could not delete ${modelName}`, 403));
    }
    doc.active = false;
    await doc.save({ validatorBeforeSave: false });
    res.status(203).json({
      status: 'success',
      data: null,
    });
  });
