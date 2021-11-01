const express = require('express');
const controller = require('./../controlles/userController');
const router = express.Router();

router.post('/signup', controller.signup);
router.post('/login', controller.login);
router.post('/auto-login', controller.protect, controller.autoLogin);
//router.post('/forgot-password', controller.forgotPassword);
router.delete('/delete', controller.protect, controller.deleteMe);
module.exports = router;
