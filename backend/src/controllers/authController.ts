// src/controllers/authController.ts
import { Request, Response } from 'express'
import { login } from '../services/authService'

export const loginController = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body
    // Validar dominio de email (configurable, por ahora hardcodeado)
    if (!email.endsWith('@diocesismerida.org')) {
      return res.status(400).json({ error: 'Dominio de email no autorizado' })
    }
    const { user, token } = await login(email, password)
    res.json({ success: true, user, token })
  } catch (error: any) {
    res.status(400).json({ error: error.message })
  }
}
