const User = require('./../models/userModel');
const Websites = require('../models/WebsitesModel');
const jwt = require('jsonwebtoken');

const catchAsync = require('./../util/catchAsync');
const AppError = require('../util/appError');
const bcrypt = require('bcrypt');

const cookieOptions = {
  maxAge: process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000,
  secure: false,
  httpOnly: true,
};

exports.signup = catchAsync(async (req, res, next) => {
  const { email, password, passwordConfirm, name } = req.body;

  if (!email || !password || !passwordConfirm) {
    return next(new AppError('No email or password!', 401));
  }

  const user = await User.create({
    name,
    email,
    password,
    passwordConfirm,
  });

  if (!user) {
    return next(new AppError('Could not create user!', 401));
  }
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
  if (!token) {
    return next(new AppError('Could not process login!', 404));
  }
  res.cookie('jwt', token, cookieOptions);
  user.password = undefined;

  res.status(201).json({
    status: 'success',
    data: {
      user,
    },
  });
});
exports.autoLogin = catchAsync(async (req, res, next) => {
  res.status(200).json({
    status: 'success',
    data: null,
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new AppError('Please provide password and email!', 404));
  }

  const user = await User.findOne({
    email,
  }).select('+password');
  if (!user) {
    return next(new AppError('No user found for the email address'));
  }
  const correct = await bcrypt.compare(password, user.password);

  if (!user || !correct) {
    return next(new AppError('Incorrect email or passowrd!', 404));
  }

  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  if (!token) {
    return next(new AppError('Could not process login!', 404));
  }
  res.cookie('jwt', token, cookieOptions);
  user.password = undefined;
  res.status(200).json({
    status: 'success',
    data: {
      user,
    },
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (email === process.env.ADMIN_MAIL) {
    return next(new AppError('Cant delete admin mail!', 401));
  }

  if (!email || !password) {
    return next(new AppError('Please provide password and email!', 404));
  }

  const user = await User.findOne({
    email,
  }).select('+password');
  const correct = await bcrypt.compare(password, user.password);

  if (!user || !correct) {
    return next(new AppError('Incorrect email or passowrd!', 404));
  }

  user.active = false;
  website.email = `deleted - ${website.email}`;

  await user.save({ validatorBeforeSave: false });

  res.status(203).json({
    status: 'success',
    data: null,
  });
});

//Protect on sources if user is not logged in
exports.protect = catchAsync(async (req, res, next) => {
  /*if (!token) return next(new AppError('not logged in!', 403));

  jwt.verify(token, process.env.JWT_SECRET, (err, decode) => {
    const currentUser = User.findById(decode.id);
    if (!currentUser) {
      return next(new AppError('User not found!', 404));
    }

    const timeStamp = decode.iat;

    if (
      currentUser?.passwordChangeDate?.getTime() / 1000 &&
      currentUser.passwordChangeDate > timeStamp
    ) {
      return next(new AppError('Incorrect password or email!', 404));
    }
  });*/
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new AppError('Please provide email and password!'));
  }

  const user = await User.findOne({
    email,
  }).select('+password');

  const correct = await bcrypt.compare(password, user.password);
  if (!user || !correct) {
    return next(new AppError('No user found for the email address'));
  }

  next();
});
//////////////////////////////////////////////////////
//PASSWORD RESET
/////////////////////////////////////////////////////////////
