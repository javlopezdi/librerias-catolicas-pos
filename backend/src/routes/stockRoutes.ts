// src/routes/stockRoutes.ts
import express from 'express'
import { body } from 'express-validator'
import {
  getStocksController,
  getStockByIdController,
  createOrUpdateStockController,
  adjustStockController,
  deleteStockController,
} from '../controllers/stockController'
import { protect, authorize } from '../middlewares/authMiddleware'
import { validate } from '../middlewares/validateMiddleware'

const router = express.Router()

router.get('/', protect, getStocksController)
router.get('/:id', protect, getStockByIdController)
router.post(
  '/',
  protect,
  authorize('Admin', 'Almacén', 'Compras'),
  [
    body('productId').isMongoId().withMessage('ID de producto inválido'),
    body('locationId').isMongoId().withMessage('ID de ubicación inválido'),
    body('quantity').isNumeric().withMessage('Cantidad debe ser numérica'),
    validate,
  ],
  createOrUpdateStockController
)
router.put(
  '/adjust',
  protect,
  authorize('Admin', 'Almacén', 'Compras'),
  [
    body('productId').isMongoId(),
    body('locationId').isMongoId(),
    body('adjustment').isNumeric().withMessage('Ajuste debe ser numérico'),
    validate,
  ],
  adjustStockController
)
router.delete(
  '/:id',
  protect,
  authorize('Admin', 'Almacén', 'Compras'),
  deleteStockController
)

export default router
