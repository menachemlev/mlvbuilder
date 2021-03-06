const express = require('express');

const adminRouter = require('./routes/adminRoute');
const websitesRouter = require('./routes/websitesRoute');
const userRouter = require('./routes/usersRoutes');
const errorController = require('./controlles/errorController');

const aws = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
const compression = require('compression');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');
const path = require('path');
const AppError = require('./util/appError');

const s3 = new aws.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const uploadS3 = multer({
  fileFilter: (req, file, cb) => {
    const type = file.mimetype;
    const isImage = type.includes('image');
    if (!isImage) return cb(new AppError('You can upload only images!', 403));
    return cb(null, true);
  },
  storage: multerS3({
    s3,
    bucket: 'mlvbuilder111',
    acl: 'public-read',
    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
      cb(null, Date.now().toString());
    },
  }),
});

const app = express();

const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour',
});
app.use(compression());
app.use(
  helmet({
    contentSecurityPolicy: false,
  })
);
app.use(express.json({ limit: '100kb' }));
app.use(cookieParser());
app.use(mongoSanitize());
app.use(xss());
app.use(hpp());

app.use(
  cors({
    origin: '*',
  })
);

app.use('/api/photos', express.static(path.join(__dirname, './photos')));
app.use(express.static(path.join(__dirname, './../frontend/build')));

//Route handler
/////////////////////////////////////////
app.use('/api/users/login', limiter);
app.use('/api/users/signup', limiter);

app.use('/api/web/', websitesRouter);
app.use('/api/users/', userRouter);
app.use('/api/admin/', adminRouter);

//PHOTO UPLOAD

app.post('/api/images/upload', uploadS3.single('img'), (req, res, next) => {
  const { location } = req.file;
  if (!location) return next(new AppError('Could not upload the file!', 500));
  res.status(201).json({
    status: 'success',
    location: req.file.location,
  });
});

//ERROR CONTROLL
app.use('*', errorController);
app.get('*', (req, res) =>
  res.sendFile(path.join(__dirname, './../frontend/build/index.html'))
);
module.exports = app;
