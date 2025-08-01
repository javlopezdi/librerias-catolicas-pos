// src/routes/categoryRoutes.ts
import express from 'express'
import { body } from 'express-validator'
import {
  getCategoriesController,
  getCategoryByIdController,
  createCategoryController,
  updateCategoryController,
  deleteCategoryController,
} from '../controllers/categoryController'
import { protect, authorize } from '../middlewares/authMiddleware'
import { validate } from '../middlewares/validateMiddleware'

const router = express.Router()

router.get('/', protect, getCategoriesController)
router.get('/:id', protect, getCategoryByIdController)
router.post(
  '/',
  protect,
  authorize('Admin', 'Almacén', 'Compras'),
  [body('name').notEmpty().withMessage('Nombre requerido'), validate],
  createCategoryController
)
router.put(
  '/:id',
  protect,
  authorize('Admin', 'Almacén', 'Compras'),
  [body('name').optional().notEmpty(), validate],
  updateCategoryController
)
router.delete(
  '/:id',
  protect,
  authorize('Admin', 'Almacén', 'Compras'),
  deleteCategoryController
)

export default router
