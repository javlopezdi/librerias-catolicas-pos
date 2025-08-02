// src/routes/resetRoutes.ts (nueva ruta para reset manual, protegida para Admin)
import express from 'express'
import { resetMonthlyMetricsController } from '../controllers/resetController'
import { protect, authorize } from '../middlewares/authMiddleware'

const router = express.Router()

router.post(
  '/monthly',
  protect,
  authorize('Admin'),
  resetMonthlyMetricsController
)

export default router
