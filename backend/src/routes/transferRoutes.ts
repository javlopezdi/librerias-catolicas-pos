// src/routes/transferRoutes.ts
import express from 'express'
import { body } from 'express-validator'
import {
  getTransfersController,
  getTransferByIdController,
  createTransferController,
  deleteTransferController,
} from '../controllers/transferController'
import { protect, authorize } from '../middlewares/authMiddleware'
import { validate } from '../middlewares/validateMiddleware'

const router = express.Router()

router.get('/', protect, authorize('Admin', 'Almacén'), getTransfersController)
router.get(
  '/:id',
  protect,
  authorize('Admin', 'Almacén'),
  getTransferByIdController
)
router.post(
  '/',
  protect,
  authorize('Admin', 'Almacén'),
  [
    body('fromLocationId').isMongoId(),
    body('toLocationId').isMongoId(),
    body('items').isArray({ min: 1 }),
    body('items.*.productId').isMongoId(),
    body('items.*.quantity')
      .isNumeric()
      .custom((v) => v > 0),
    validate,
  ],
  createTransferController
)
router.delete(
  '/:id',
  protect,
  authorize('Admin', 'Almacén'),
  deleteTransferController
)

export default router
