// src/controllers/importController.ts (nuevo controlador para imports)
import { Request, Response } from 'express'
import {
  importProductsCSV,
  importCustomersCSV,
} from '../services/importService'

export const importProductsController = async (req: Request, res: Response) => {
  try {
    if (!req.file)
      return res.status(400).json({ error: 'Archivo CSV requerido' })
    const result = await importProductsCSV(req.file.buffer, req.body.locationId)
    res.json({ success: true, data: result })
  } catch (error: any) {
    res.status(400).json({ error: error.message })
  }
}

export const importCustomersController = async (
  req: Request,
  res: Response
) => {
  try {
    if (!req.file)
      return res.status(400).json({ error: 'Archivo CSV requerido' })
    const result = await importCustomersCSV(req.file.buffer)
    res.json({ success: true, data: result })
  } catch (error: any) {
    res.status(400).json({ error: error.message })
  }
}
