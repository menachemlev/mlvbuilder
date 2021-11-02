const express = require('express');

const adminRouter = require('./routes/adminRoute');
const websitesRouter = require('./routes/websitesRoute');
const userRouter = require('./routes/usersRoutes');
const errorController = require('./controlles/errorController');

const compression = require('compression');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');
const path = require('path');
const multer = require('multer');
const AppError = require('./util/appError');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, __dirname + '\\uploads');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + '-' + uniqueSuffix + '.' + file.mimetype.split('/')[1]
    );
  },
});
const upload = multer({ storage });

const app = express();

const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour',
});
app.use(compression());
app.use(helmet());
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
app.options(
  '*',
  cors({
    credentials: true,
  })
);
app.use(express.static(path.join(__dirname, './../frontend/build')));

//Route handler
/////////////////////////////////////////
app.use('/users/login', limiter);
app.use('/users/signup', limiter);

app.use('/web/', websitesRouter);
app.use('/users/', userRouter);
app.use('/admin/', adminRouter);

//PHOTO UPLOAD
app.post('/images/upload', upload.single('img'), (req, res, next) => {
  if (!req.file.mimetype.includes('image'))
    return next(AppError('Can not upload not image files!', 401));
  res.status(201).json({
    status: 'success',
    fileName: req.file.filename,
  });
});

app.get('/images/:filename', (req, res, next) => {
  res.sendFile(__dirname + '\\uploads\\' + req.params.filename);
});

//ERROR CONTROLL
app.use('*', errorController);

module.exports = app;
