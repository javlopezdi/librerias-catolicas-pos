// src/routes/reportRoutes.ts
import express from 'express'
import { query } from 'express-validator'
import {
  getSalesByDayController,
  getTopProductsController,
  getTotalIncomeController,
  getCreditLayawayReportsController,
} from '../controllers/reportController'
import { protect, authorize } from '../middlewares/authMiddleware'
import { validate } from '../middlewares/validateMiddleware'

const router = express.Router()

// Protegidas para Admin y Vendedor (con datos limitados para Vendedor)
router.get(
  '/sales-by-day',
  protect,
  authorize('Admin', 'Vendedor'),
  [
    query('fromDate').optional().isISO8601().toDate(),
    query('toDate').optional().isISO8601().toDate(),
    query('period').optional().isIn(['daily', 'weekly', 'monthly']),
    validate,
  ],
  getSalesByDayController
)

router.get(
  '/top-products',
  protect,
  authorize('Admin', 'Vendedor'),
  [
    query('fromDate').optional().isISO8601().toDate(),
    query('toDate').optional().isISO8601().toDate(),
    query('limit').optional().isInt({ min: 1 }),
    validate,
  ],
  getTopProductsController
)

router.get(
  '/total-income',
  protect,
  authorize('Admin', 'Vendedor'),
  [
    query('fromDate').optional().isISO8601().toDate(),
    query('toDate').optional().isISO8601().toDate(),
    validate,
  ],
  getTotalIncomeController
)

router.get(
  '/credit-layaway',
  protect,
  authorize('Admin', 'Vendedor'),
  [
    query('fromDate').optional().isISO8601().toDate(),
    query('toDate').optional().isISO8601().toDate(),
    query('status').optional().isIn(['completed', 'pending']),
    validate,
  ],
  getCreditLayawayReportsController
)

export default router
