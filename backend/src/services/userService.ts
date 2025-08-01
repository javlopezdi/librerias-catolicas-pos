// src/services/userService.ts
import User from '../models/User'
import bcrypt from 'bcryptjs'

export const getUsers = async () => {
  return await User.find().select('-password')
}

export const getUserById = async (id: string) => {
  return await User.findById(id).select('-password')
}

export const createUser = async (data: any) => {
  const { name, email, password, role } = data
  const hashedPassword = await bcrypt.hash(password, 10)
  const user = new User({ name, email, password: hashedPassword, role })
  return await user.save()
}

export const updateUser = async (id: string, data: any) => {
  if (data.password) {
    data.password = await bcrypt.hash(data.password, 10)
  }
  return await User.findByIdAndUpdate(id, data, { new: true }).select(
    '-password'
  )
}

export const deleteUser = async (id: string) => {
  return await User.findByIdAndDelete(id)
}
