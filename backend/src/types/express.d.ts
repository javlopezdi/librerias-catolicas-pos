// src/types/express.d.ts (actualizado para tipado correcto de req.user)
import { IUser } from '../models/User'

declare global {
  namespace Express {
    interface Request {
      user: IUser // Tipado estricto con IUser
    }
  }
}
