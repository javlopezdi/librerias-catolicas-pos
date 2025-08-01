// src/controllers/customerController.ts
import { Request, Response } from 'express'
import {
  getCustomers,
  getCustomerById,
  createCustomer,
  updateCustomer,
  deleteCustomer,
} from '../services/customerService'

export const getCustomersController = async (req: Request, res: Response) => {
  try {
    const customers = await getCustomers()
    res.json({ success: true, data: customers })
  } catch (error: any) {
    throw error
  }
}

export const getCustomerByIdController = async (
  req: Request,
  res: Response
) => {
  try {
    const customer = await getCustomerById(req.params.id)
    if (!customer)
      return res.status(404).json({ error: 'Cliente no encontrado' })
    res.json({ success: true, data: customer })
  } catch (error: any) {
    throw error
  }
}

export const createCustomerController = async (req: Request, res: Response) => {
  try {
    const customer = await createCustomer(req.body)
    res.status(201).json({ success: true, data: customer })
  } catch (error: any) {
    throw error
  }
}

export const updateCustomerController = async (req: Request, res: Response) => {
  try {
    const customer = await updateCustomer(req.params.id, req.body)
    if (!customer)
      return res.status(404).json({ error: 'Cliente no encontrado' })
    res.json({ success: true, data: customer })
  } catch (error: any) {
    throw error
  }
}

export const deleteCustomerController = async (req: Request, res: Response) => {
  try {
    const customer = await deleteCustomer(req.params.id)
    if (!customer)
      return res.status(404).json({ error: 'Cliente no encontrado' })
    res.json({ success: true, message: 'Cliente eliminado' })
  } catch (error: any) {
    throw error
  }
}
