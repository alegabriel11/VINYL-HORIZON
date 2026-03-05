const express = require('express');
const router = express.Router();
const vinylController = require('../controllers/vinylController');

// Helper to handle async errors
const asyncHandler = fn => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

// POST /api/vinyls
router.post('/', asyncHandler(vinylController.createVinyl));

// GET /api/vinyls
router.get('/', asyncHandler(vinylController.getVinyls));

// PUT /api/vinyls/:sku
router.put('/:sku', asyncHandler(vinylController.updateVinyl));

// DELETE /api/vinyls/:sku
router.delete('/:sku', asyncHandler(vinylController.deleteVinyl));

module.exports = router;
