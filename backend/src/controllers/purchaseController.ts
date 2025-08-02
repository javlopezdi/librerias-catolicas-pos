// src/controllers/purchaseController.ts (actualizado con cast temporal para resolver TS2339)
import { Request, Response } from 'express'
import {
  getPurchases,
  getPurchaseById,
  createPurchase,
  deletePurchase,
} from '../services/purchaseService'

export const getPurchasesController = async (req: Request, res: Response) => {
  try {
    const purchases = await getPurchases(req.query)
    res.json({ success: true, data: purchases })
  } catch (error: any) {
    throw error
  }
}

export const getPurchaseByIdController = async (
  req: Request,
  res: Response
) => {
  try {
    const purchase = await getPurchaseById(req.params.id)
    if (!purchase)
      return res.status(404).json({ error: 'Compra no encontrada' })
    res.json({ success: true, data: purchase })
  } catch (error: any) {
    throw error
  }
}

export const createPurchaseController = async (req: Request, res: Response) => {
  try {
    const purchase = await createPurchase({
      ...req.body,
      userId: (req as any).user._id,
    })
    res.status(201).json({ success: true, data: purchase })
  } catch (error: any) {
    res.status(400).json({ error: error.message })
  }
}

export const deletePurchaseController = async (req: Request, res: Response) => {
  try {
    const result = await deletePurchase(req.params.id)
    res.json({ success: true, ...result })
  } catch (error: any) {
    res.status(400).json({ error: error.message })
  }
}
