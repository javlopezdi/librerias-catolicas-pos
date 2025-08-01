// src/routes/userRoutes.ts
import express from 'express'
import { body } from 'express-validator'
import {
  getUsersController,
  getUserByIdController,
  createUserController,
  updateUserController,
  deleteUserController,
} from '../controllers/userController'
import { protect, authorize } from '../middlewares/authMiddleware'
import { validate } from '../middlewares/validateMiddleware'

const router = express.Router()

// Protegidas, solo Admin puede gestionar usuarios (basado en wireframe: Pantalla de Empleados solo para Admin)
router.get('/', protect, authorize('Admin'), getUsersController)
router.get('/:id', protect, authorize('Admin'), getUserByIdController)
router.post(
  '/',
  protect,
  authorize('Admin'),
  [
    body('name').notEmpty(),
    body('email').isEmail(),
    body('password').isLength({ min: 6 }),
    body('role').isIn(['Admin', 'Vendedor', 'Almacén', 'Compras']),
    validate,
  ],
  createUserController
)
router.put(
  '/:id',
  protect,
  authorize('Admin'),
  [
    body('name').optional().notEmpty(),
    body('email').optional().isEmail(),
    body('password').optional().isLength({ min: 6 }),
    body('role').optional().isIn(['Admin', 'Vendedor', 'Almacén', 'Compras']),
    validate,
  ],
  updateUserController
)
router.delete('/:id', protect, authorize('Admin'), deleteUserController)

export default router
