// src/controllers/saleController.ts
import { Request, Response } from 'express'
import {
  getSales,
  getSaleById,
  createSale,
  updateSale,
  deleteSale,
} from '../services/saleService'

export const getSalesController = async (req: Request, res: Response) => {
  try {
    const sales = await getSales(req.query)
    res.json({ success: true, data: sales })
  } catch (error: any) {
    throw error
  }
}

export const getSaleByIdController = async (req: Request, res: Response) => {
  try {
    const sale = await getSaleById(req.params.id)
    if (!sale) return res.status(404).json({ error: 'Venta no encontrada' })
    res.json({ success: true, data: sale })
  } catch (error: any) {
    throw error
  }
}

export const createSaleController = async (req: Request, res: Response) => {
  try {
    const sale = await createSale({ ...req.body, userId: req.user._id }) // Usar userId del token para auditoría
    res.status(201).json({ success: true, data: sale })
  } catch (error: any) {
    res.status(400).json({ error: error.message })
  }
}

export const updateSaleController = async (req: Request, res: Response) => {
  try {
    const sale = await updateSale(req.params.id, req.body)
    if (!sale) return res.status(404).json({ error: 'Venta no encontrada' })
    res.json({ success: true, data: sale })
  } catch (error: any) {
    throw error
  }
}

export const deleteSaleController = async (req: Request, res: Response) => {
  try {
    const result = await deleteSale(req.params.id)
    res.json({ success: true, ...result })
  } catch (error: any) {
    res.status(400).json({ error: error.message })
  }
}
