// src/controllers/resetController.ts (nuevo controlador para reset manual)
import { Request, Response } from 'express'
import { resetMonthlyMetrics } from '../services/resetService'

export const resetMonthlyMetricsController = async (
  req: Request,
  res: Response
) => {
  try {
    const result = await resetMonthlyMetrics()
    res.json({ success: true, data: result })
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
}
