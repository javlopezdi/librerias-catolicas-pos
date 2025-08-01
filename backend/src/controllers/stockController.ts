// src/controllers/stockController.ts
import { Request, Response } from 'express'
import {
  getStocks,
  getStockById,
  createOrUpdateStock,
  adjustStock,
  deleteStock,
} from '../services/stockService'

export const getStocksController = async (req: Request, res: Response) => {
  try {
    const stocks = await getStocks(req.query)
    res.json({ success: true, data: stocks })
  } catch (error: any) {
    throw error
  }
}

export const getStockByIdController = async (req: Request, res: Response) => {
  try {
    const stock = await getStockById(req.params.id)
    if (!stock) return res.status(404).json({ error: 'Stock no encontrado' })
    res.json({ success: true, data: stock })
  } catch (error: any) {
    throw error
  }
}

export const createOrUpdateStockController = async (
  req: Request,
  res: Response
) => {
  try {
    const stock = await createOrUpdateStock(req.body)
    res.status(201).json({ success: true, data: stock })
  } catch (error: any) {
    throw error
  }
}

export const adjustStockController = async (req: Request, res: Response) => {
  try {
    const { productId, locationId, adjustment } = req.body
    const stock = await adjustStock(productId, locationId, adjustment)
    if (!stock) return res.status(404).json({ error: 'Stock no encontrado' })
    res.json({ success: true, data: stock })
  } catch (error: any) {
    throw error
  }
}

export const deleteStockController = async (req: Request, res: Response) => {
  try {
    const stock = await deleteStock(req.params.id)
    if (!stock) return res.status(404).json({ error: 'Stock no encontrado' })
    res.json({ success: true, message: 'Stock eliminado' })
  } catch (error: any) {
    throw error
  }
}
