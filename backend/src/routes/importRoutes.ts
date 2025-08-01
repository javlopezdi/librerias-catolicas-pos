// src/routes/importRoutes.ts (nuevas rutas para imports)
import express from 'express'
import { body } from 'express-validator'
import {
  importProductsController,
  importCustomersController,
} from '../controllers/importController'
import { protect, authorize } from '../middlewares/authMiddleware'
import { uploadSingle } from '../middlewares/uploadMiddleware'
import { validate } from '../middlewares/validateMiddleware'

const router = express.Router()

router.post(
  '/products',
  protect,
  authorize('Admin', 'Almacén', 'Compras'),
  uploadSingle,
  [
    body('locationId')
      .isMongoId()
      .withMessage('ID de ubicación requerido para stock'),
    validate,
  ],
  importProductsController
)

router.post(
  '/customers',
  protect,
  authorize('Admin', 'Vendedor'),
  uploadSingle,
  validate,
  importCustomersController
)

export default router
