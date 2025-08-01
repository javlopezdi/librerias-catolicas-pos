// src/routes/customerRoutes.ts
import express from 'express'
import { body } from 'express-validator'
import {
  getCustomersController,
  getCustomerByIdController,
  createCustomerController,
  updateCustomerController,
  deleteCustomerController,
} from '../controllers/customerController'
import { protect, authorize } from '../middlewares/authMiddleware'
import { validate } from '../middlewares/validateMiddleware'

const router = express.Router()

// Protegidas: Visible para Vendedor/Admin, con CRUD para gestión de créditos/apartados
router.get('/', protect, authorize('Admin', 'Vendedor'), getCustomersController)
router.get(
  '/:id',
  protect,
  authorize('Admin', 'Vendedor'),
  getCustomerByIdController
)
router.post(
  '/',
  protect,
  authorize('Admin', 'Vendedor'),
  [
    body('name').notEmpty().withMessage('Nombre requerido'),
    body('email').isEmail().withMessage('Email inválido'),
    body('phone').notEmpty().withMessage('Teléfono requerido'),
    validate,
  ],
  createCustomerController
)
router.put(
  '/:id',
  protect,
  authorize('Admin', 'Vendedor'),
  [
    body('name').optional().notEmpty(),
    body('email').optional().isEmail(),
    body('phone').optional().notEmpty(),
    validate,
  ],
  updateCustomerController
)
router.delete(
  '/:id',
  protect,
  authorize('Admin', 'Vendedor'),
  deleteCustomerController
)

export default router
