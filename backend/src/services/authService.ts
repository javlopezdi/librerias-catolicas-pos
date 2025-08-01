// src/services/authService.ts
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from '../models/User'

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret'

export const login = async (email: string, password: string) => {
  const user = await User.findOne({ email })
  if (!user) {
    throw new Error('Credenciales inválidas')
  }

  const isMatch = await bcrypt.compare(password, user.password)
  if (!isMatch) {
    throw new Error('Credenciales inválidas')
  }

  const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' })
  return { user, token }
}
