// src/routes/settingRoutes.ts
import express from 'express'
import { body } from 'express-validator'
import {
  getSettingsController,
  getSettingByTypeController,
  createOrUpdateSettingController,
  deleteSettingController,
} from '../controllers/settingController'
import { protect, authorize } from '../middlewares/authMiddleware'
import { validate } from '../middlewares/validateMiddleware'

const router = express.Router()

// Protegidas solo para Admin
router.get('/', protect, authorize('Admin'), getSettingsController)
router.get('/:type', protect, authorize('Admin'), getSettingByTypeController)
router.put(
  '/:type',
  protect,
  authorize('Admin'),
  [body('data').exists().withMessage('Datos requeridos'), validate],
  createOrUpdateSettingController
)
router.delete('/:type', protect, authorize('Admin'), deleteSettingController)

export default router
