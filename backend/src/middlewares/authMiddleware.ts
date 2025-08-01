// src/middlewares/authMiddleware.ts
import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import User from '../models/User'

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret' // Agregar a .env

export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let token: string | undefined
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1]
  }

  if (!token) {
    return res
      .status(401)
      .json({ error: 'No autorizado, token no proporcionado' })
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string }
    req.user = await User.findById(decoded.id).select('-password')
    if (!req.user) {
      return res
        .status(401)
        .json({ error: 'No autorizado, usuario no encontrado' })
    }
    next()
  } catch (error) {
    res.status(401).json({ error: 'No autorizado, token inválido' })
  }
}

export const authorize = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!roles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ error: 'Acceso denegado, rol insuficiente' })
    }
    next()
  }
}
