// src/controllers/reportController.ts (actualizado con casts temporales para resolver TS2339)
import { Request, Response } from 'express'
import {
  getSalesByDay,
  getTopProducts,
  getTotalIncome,
  getCreditLayawayReports,
} from '../services/reportService'

export const getSalesByDayController = async (req: Request, res: Response) => {
  try {
    if (!(req as any).user || !(req as any).user._id) {
      return res.status(401).json({ error: 'Usuario no autenticado' })
    }
    const sales = await getSalesByDay(
      req.query,
      (req as any).user._id.toString(),
      (req as any).user.role
    )
    res.json({ success: true, data: sales })
  } catch (error: any) {
    throw error
  }
}

export const getTopProductsController = async (req: Request, res: Response) => {
  try {
    if (!(req as any).user || !(req as any).user._id) {
      return res.status(401).json({ error: 'Usuario no autenticado' })
    }
    const products = await getTopProducts(
      req.query,
      (req as any).user._id.toString(),
      (req as any).user.role
    )
    res.json({ success: true, data: products })
  } catch (error: any) {
    throw error
  }
}

export const getTotalIncomeController = async (req: Request, res: Response) => {
  try {
    if (!(req as any).user || !(req as any).user._id) {
      return res.status(401).json({ error: 'Usuario no autenticado' })
    }
    const income = await getTotalIncome(
      req.query,
      (req as any).user._id.toString(),
      (req as any).user.role
    )
    res.json({ success: true, data: income })
  } catch (error: any) {
    throw error
  }
}

export const getCreditLayawayReportsController = async (
  req: Request,
  res: Response
) => {
  try {
    if (!(req as any).user || !(req as any).user._id) {
      return res.status(401).json({ error: 'Usuario no autenticado' })
    }
    const reports = await getCreditLayawayReports(
      req.query,
      (req as any).user._id.toString(),
      (req as any).user.role
    )
    res.json({ success: true, data: reports })
  } catch (error: any) {
    throw error
  }
}
