// src/routes/locationRoutes.ts
import express from 'express'
import { body } from 'express-validator'
import {
  getLocationsController,
  getLocationByIdController,
  createLocationController,
  updateLocationController,
  deleteLocationController,
} from '../controllers/locationController'
import { protect, authorize } from '../middlewares/authMiddleware'
import { validate } from '../middlewares/validateMiddleware'

const router = express.Router()

// Protegidas: Todos pueden leer si tienen acceso, pero solo Admin/Almacén modifican (basado en wireframe)
router.get('/', protect, getLocationsController)
router.get('/:id', protect, getLocationByIdController)
router.post(
  '/',
  protect,
  authorize('Admin', 'Almacén'),
  [
    body('name').notEmpty().withMessage('Nombre requerido'),
    body('city').notEmpty().withMessage('Ciudad requerida'),
    body('address').notEmpty().withMessage('Dirección requerida'),
    validate,
  ],
  createLocationController
)
router.put(
  '/:id',
  protect,
  authorize('Admin', 'Almacén'),
  [
    body('name').optional().notEmpty(),
    body('city').optional().notEmpty(),
    body('address').optional().notEmpty(),
    validate,
  ],
  updateLocationController
)
router.delete(
  '/:id',
  protect,
  authorize('Admin', 'Almacén'),
  deleteLocationController
)

export default router
