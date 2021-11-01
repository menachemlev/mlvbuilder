const User = require('./../models/userModel');
const Websites = require('../models/WebsitesModel');
const catchAsync = require('./../util/catchAsync');
const AppError = require('../util/appError');

exports.getWebsitesAndUsers = catchAsync(async (req, res, next) => {
  if (req.body.email !== process.env.ADMIN_MAIL) return;
  let data = [];
  const users = await User.find();
  if (typeof users === undefined) {
    return next(new AppError('Could not find users', 404));
  }
  const websites = await Websites.find();
  if (typeof websites === undefined) {
    return next(new AppError('Could not look for websites', 404));
  }
  users.forEach((user) => {
    if (user.email !== process.env.ADMIN_MAIL)
      data.push({
        user: user.email,
        websites: websites.filter((website) => website.email === user.email),
      });
  });

  res.status(200).json({
    status: 'success',
    data,
  });
});

exports.deleteUser = catchAsync(async (req, res, next) => {
  if (req.body.email !== process.env.ADMIN_MAIL) return;

  const user = await User.findOneAndDelete({ email: req.body.userEmail });

  if (!user | !req.body.userEmail) {
    return next('No user found!', 404);
  }

  const websitesList = await Websites.aggregate([
    {
      $match: {
        email: req.body.email,
      },
    },
  ]);

  if (typeof websitesList === undefined) {
    return next(new AppError('Could not look for websites', 500));
  }
  user.delete();
  // user.active = undefined;
  //  await user.save({ validatorBeforeSave: false });

  websitesList.forEach(async (website) => {
    await Websites.findByIdAndDelete(website.id);
  });

  res.status(203).json({
    status: 'success',
    data: null,
  });
});

exports.deleteWebsite = catchAsync(async (req, res, next) => {
  if (req.body.email !== process.env.ADMIN_MAIL) return;
  const website = await Websites.findByIdAndDelete(req.params.id);
  if (!website) {
    return next('No website found!', 404);
  }

  res.status(203).json({
    status: 'success',
    data: null,
  });
});
