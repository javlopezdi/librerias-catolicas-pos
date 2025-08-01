// src/controllers/supplierController.ts
import { Request, Response } from 'express'
import {
  getSuppliers,
  getSupplierById,
  createSupplier,
  updateSupplier,
  deleteSupplier,
} from '../services/supplierService'

export const getSuppliersController = async (req: Request, res: Response) => {
  try {
    const suppliers = await getSuppliers()
    res.json({ success: true, data: suppliers })
  } catch (error: any) {
    throw error
  }
}

export const getSupplierByIdController = async (
  req: Request,
  res: Response
) => {
  try {
    const supplier = await getSupplierById(req.params.id)
    if (!supplier)
      return res.status(404).json({ error: 'Proveedor no encontrado' })
    res.json({ success: true, data: supplier })
  } catch (error: any) {
    throw error
  }
}

export const createSupplierController = async (req: Request, res: Response) => {
  try {
    const supplier = await createSupplier(req.body)
    res.status(201).json({ success: true, data: supplier })
  } catch (error: any) {
    throw error
  }
}

export const updateSupplierController = async (req: Request, res: Response) => {
  try {
    const supplier = await updateSupplier(req.params.id, req.body)
    if (!supplier)
      return res.status(404).json({ error: 'Proveedor no encontrado' })
    res.json({ success: true, data: supplier })
  } catch (error: any) {
    throw error
  }
}

export const deleteSupplierController = async (req: Request, res: Response) => {
  try {
    const supplier = await deleteSupplier(req.params.id)
    if (!supplier)
      return res.status(404).json({ error: 'Proveedor no encontrado' })
    res.json({ success: true, message: 'Proveedor eliminado' })
  } catch (error: any) {
    throw error
  }
}
