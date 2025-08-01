// src/controllers/userController.ts
import { Request, Response } from 'express'
import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from '../services/userService'

export const getUsersController = async (req: Request, res: Response) => {
  try {
    const users = await getUsers()
    res.json({ success: true, data: users })
  } catch (error: any) {
    throw error
  }
}

export const getUserByIdController = async (req: Request, res: Response) => {
  try {
    const user = await getUserById(req.params.id)
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' })
    res.json({ success: true, data: user })
  } catch (error: any) {
    throw error
  }
}

export const createUserController = async (req: Request, res: Response) => {
  try {
    const user = await createUser(req.body)
    res.status(201).json({ success: true, data: user })
  } catch (error: any) {
    throw error
  }
}

export const updateUserController = async (req: Request, res: Response) => {
  try {
    const user = await updateUser(req.params.id, req.body)
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' })
    res.json({ success: true, data: user })
  } catch (error: any) {
    throw error
  }
}

export const deleteUserController = async (req: Request, res: Response) => {
  try {
    const user = await deleteUser(req.params.id)
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' })
    res.json({ success: true, message: 'Usuario eliminado' })
  } catch (error: any) {
    throw error
  }
}
