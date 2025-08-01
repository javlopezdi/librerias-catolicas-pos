// src/routes/supplierRoutes.ts
import express from 'express'
import { body } from 'express-validator'
import {
  getSuppliersController,
  getSupplierByIdController,
  createSupplierController,
  updateSupplierController,
  deleteSupplierController,
} from '../controllers/supplierController'
import { protect, authorize } from '../middlewares/authMiddleware'
import { validate } from '../middlewares/validateMiddleware'

const router = express.Router()

// Protegidas: Todos con acceso pueden leer, pero solo Compras/Admin/Almacén modifican (basado en wireframe)
router.get('/', protect, getSuppliersController)
router.get('/:id', protect, getSupplierByIdController)
router.post(
  '/',
  protect,
  authorize('Admin', 'Compras', 'Almacén'),
  [
    body('name').notEmpty().withMessage('Nombre requerido'),
    body('contact').notEmpty().withMessage('Contacto requerido'),
    body('email').isEmail().withMessage('Email inválido'),
    validate,
  ],
  createSupplierController
)
router.put(
  '/:id',
  protect,
  authorize('Admin', 'Compras', 'Almacén'),
  [
    body('name').optional().notEmpty(),
    body('contact').optional().notEmpty(),
    body('email').optional().isEmail(),
    validate,
  ],
  updateSupplierController
)
router.delete(
  '/:id',
  protect,
  authorize('Admin', 'Compras', 'Almacén'),
  deleteSupplierController
)

export default router
