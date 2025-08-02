// src/middlewares/auditMiddleware.ts (actualizado con cast temporal para resolver TS2339)
import { Request, Response, NextFunction } from 'express'
import AuditLog from '../models/AuditLog'

export const auditMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Ejecutar el middleware después de la respuesta para capturar el resultado
  const originalSend = res.send
  res.send = function (body: any) {
    // Registrar solo si la respuesta es exitosa (200-299) y es una operación modificadora
    if (
      res.statusCode >= 200 &&
      res.statusCode < 300 &&
      ['POST', 'PUT', 'DELETE'].includes(req.method)
    ) {
      const action = `${req.method} on ${req.path}`
      const details = JSON.stringify({
        params: req.params,
        body: req.body, // Cuidado: no loggear passwords u info sensible u filtrar si es necesario
        status: res.statusCode,
      })
      const ip =
        req.ip ||
        req.headers['x-forwarded-for'] ||
        req.socket.remoteAddress ||
        'unknown'
      const userId = (req as any).user?._id

      if (userId) {
        const auditLog = new AuditLog({
          userId,
          action,
          details,
          ip,
          date: new Date(),
        })
        auditLog
          .save()
          .catch((err) => console.error('Error saving audit log:', err))
      }
    }
    return originalSend.call(this, body)
  }
  next()
}
