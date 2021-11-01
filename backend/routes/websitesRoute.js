const express = require('express');
const controller = require('./../controlles/websitesController');
const router = express.Router();
const { protect } = require('./../controlles/userController');

router.route('/').post(protect, controller.createWebsite);
router
  .route('/:id')
  .get(controller.getWebsite)
  .patch(protect, controller.updateWebsite)
  .delete(protect, controller.deleteMyWebsite);
router.route('/elements/:id').get(controller.getPreviewElements);

router.route('/list').post(protect, controller.getWebsitesList);

module.exports = router;
