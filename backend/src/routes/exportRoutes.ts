// src/routes/exportRoutes.ts (nuevas rutas para exports)
import express from 'express'
import { exportReportController } from '../controllers/exportController'
import { protect, authorize } from '../middlewares/authMiddleware'

const router = express.Router()

router.get(
  '/:reportType/:format', // e.g., /sales-by-day/pdf
  protect,
  authorize('Admin', 'Vendedor'),
  exportReportController
)

export default router
