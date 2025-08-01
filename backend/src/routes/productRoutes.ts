// src/routes/productRoutes.ts
import express from 'express'
import { body, query } from 'express-validator'
import {
  getProductsController,
  getProductByIdController,
  createProductController,
  updateProductController,
  deleteProductController,
} from '../controllers/productController'
import { protect, authorize } from '../middlewares/authMiddleware'
import { validate } from '../middlewares/validateMiddleware'

const router = express.Router()

// Todos pueden leer, pero solo Almacén/Admin/Compras modifican (basado en wireframe)
router.get('/', protect, getProductsController)
router.get('/:id', protect, getProductByIdController)
router.post(
  '/',
  protect,
  authorize('Admin', 'Almacén', 'Compras'),
  [
    body('name').notEmpty().withMessage('Nombre requerido'),
    body('barcode').notEmpty().withMessage('Código de barras requerido'),
    body('categoryId').isMongoId().withMessage('ID de categoría inválido'),
    body('price').isNumeric().withMessage('Precio debe ser numérico'),
    validate,
  ],
  createProductController
)
router.put(
  '/:id',
  protect,
  authorize('Admin', 'Almacén', 'Compras'),
  [
    body('name').optional().notEmpty(),
    body('barcode').optional().notEmpty(),
    body('categoryId').optional().isMongoId(),
    body('price').optional().isNumeric(),
    validate,
  ],
  updateProductController
)
router.delete(
  '/:id',
  protect,
  authorize('Admin', 'Almacén', 'Compras'),
  deleteProductController
)

export default router
