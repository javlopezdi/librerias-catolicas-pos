// src/routes/purchaseRoutes.ts
import express from 'express'
import { body } from 'express-validator'
import {
  getPurchasesController,
  getPurchaseByIdController,
  createPurchaseController,
  deletePurchaseController,
} from '../controllers/purchaseController'
import { protect, authorize } from '../middlewares/authMiddleware'
import { validate } from '../middlewares/validateMiddleware'

const router = express.Router()

router.get(
  '/',
  protect,
  authorize('Admin', 'Compras', 'Almacén'),
  getPurchasesController
)
router.get(
  '/:id',
  protect,
  authorize('Admin', 'Compras', 'Almacén'),
  getPurchaseByIdController
)
router.post(
  '/',
  protect,
  authorize('Admin', 'Compras', 'Almacén'),
  [
    body('supplierId').isMongoId(),
    body('locationId').isMongoId(),
    body('items').isArray({ min: 1 }),
    body('items.*.productId').isMongoId(),
    body('items.*.quantity')
      .isNumeric()
      .custom((v) => v > 0),
    body('items.*.price')
      .isNumeric()
      .custom((v) => v > 0),
    body('total').isNumeric(),
    validate,
  ],
  createPurchaseController
)
router.delete(
  '/:id',
  protect,
  authorize('Admin', 'Compras', 'Almacén'),
  deletePurchaseController
)

export default router
