// src/routes/authRoutes.ts
import express from 'express'
import { body } from 'express-validator'
import { loginController } from '../controllers/authController'
import { validate } from '../middlewares/validateMiddleware'

const router = express.Router()

router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Email inválido'),
    body('password').notEmpty().withMessage('Contraseña requerida'),
    validate,
  ],
  loginController
)

export default router
