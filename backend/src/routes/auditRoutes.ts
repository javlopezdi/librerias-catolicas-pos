// src/routes/auditRoutes.ts
import express from 'express'
import { query } from 'express-validator'
import { getAuditLogsController } from '../controllers/auditController'
import { protect, authorize } from '../middlewares/authMiddleware'
import { validate } from '../middlewares/validateMiddleware'

const router = express.Router()

// Solo lectura para Admin
router.get(
  '/',
  protect,
  authorize('Admin'),
  [
    query('fromDate').optional().isDate().withMessage('Fecha desde inválida'),
    query('toDate').optional().isDate().withMessage('Fecha hasta inválida'),
    validate,
  ],
  getAuditLogsController
)

export default router
