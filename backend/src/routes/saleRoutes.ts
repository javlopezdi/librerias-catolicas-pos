// src/routes/saleRoutes.ts
import express from 'express'
import { body, query } from 'express-validator'
import {
  getSalesController,
  getSaleByIdController,
  createSaleController,
  updateSaleController,
  deleteSaleController,
} from '../controllers/saleController'
import { protect, authorize } from '../middlewares/authMiddleware'
import { validate } from '../middlewares/validateMiddleware'

const router = express.Router()

// Protegidas: Todos pueden ver sus ventas, pero solo Vendedor/Admin crean/actualizan/eliminan
router.get('/', protect, getSalesController)
router.get('/:id', protect, getSaleByIdController)
router.post(
  '/',
  protect,
  authorize('Admin', 'Vendedor'),
  [
    body('locationId').isMongoId().withMessage('ID de ubicación inválido'),
    body('items')
      .isArray({ min: 1 })
      .withMessage('Debe haber al menos un ítem'),
    body('items.*.productId').isMongoId(),
    body('items.*.quantity')
      .isNumeric()
      .custom((v) => v > 0),
    body('items.*.priceAtSale')
      .isNumeric()
      .custom((v) => v > 0),
    body('subtotal').isNumeric(),
    body('discount').optional().isNumeric(),
    body('total').isNumeric(),
    body('type').isIn(['cash', 'credit', 'layaway']),
    body('status').optional().isIn(['completed', 'pending']),
    validate,
  ],
  createSaleController
)
router.put(
  '/:id',
  protect,
  authorize('Admin', 'Vendedor'),
  [body('status').optional().isIn(['completed', 'pending']), validate],
  updateSaleController
)
router.delete(
  '/:id',
  protect,
  authorize('Admin', 'Vendedor'),
  deleteSaleController
)

export default router
