const express = require('express');
const router = express.Router();
const vinylController = require('../controllers/vinylController');

// Helper to handle async errors
const asyncHandler = fn => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

// POST /api/vinyls/checkout
router.post('/checkout', asyncHandler(vinylController.checkout));

// GET /api/vinyls/orders
router.get('/orders', asyncHandler(vinylController.getOrders));

// PUT /api/vinyls/orders/:id/status
router.put('/orders/:id/status', asyncHandler(vinylController.updateOrderStatus));

// POST /api/vinyls
router.post('/', asyncHandler(vinylController.createVinyl));

// GET /api/vinyls
router.get('/', asyncHandler(vinylController.getVinyls));

// PUT /api/vinyls/:sku
router.put('/:sku', asyncHandler(vinylController.updateVinyl));

// DELETE /api/vinyls/:sku
router.delete('/:sku', asyncHandler(vinylController.deleteVinyl));

// ==== Waitlist & Notifications ====

// POST /api/vinyls/:sku/waitlist
router.post('/:sku/waitlist', asyncHandler(vinylController.addToWaitlist));

// GET /api/vinyls/:sku/waitlist/count
router.get('/:sku/waitlist/count', asyncHandler(vinylController.getWaitlistCount));

// GET /api/vinyls/notifications/user
router.get('/notifications/user', asyncHandler(vinylController.getUserNotifications));

// GET /api/vinyls/notifications/admin
router.get('/notifications/admin', asyncHandler(vinylController.getAdminNotifications));

module.exports = router;
