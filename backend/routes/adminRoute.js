const express = require('express');
const controller = require('./../controlles/adminController');
const { protect } = require('./../controlles/userController');
const router = express.Router();

router.post('/', protect, controller.getWebsitesAndUsers);
router.delete('/user/', protect, controller.deleteUser);
router.delete('/web/:id', protect, controller.deleteWebsite);

module.exports = router;
