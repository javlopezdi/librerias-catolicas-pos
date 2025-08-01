// src/controllers/transferController.ts
import { Request, Response } from 'express'
import {
  getTransfers,
  getTransferById,
  createTransfer,
  deleteTransfer,
} from '../services/transferService'

export const getTransfersController = async (req: Request, res: Response) => {
  try {
    const transfers = await getTransfers(req.query)
    res.json({ success: true, data: transfers })
  } catch (error: any) {
    throw error
  }
}

export const getTransferByIdController = async (
  req: Request,
  res: Response
) => {
  try {
    const transfer = await getTransferById(req.params.id)
    if (!transfer)
      return res.status(404).json({ error: 'Traslado no encontrado' })
    res.json({ success: true, data: transfer })
  } catch (error: any) {
    throw error
  }
}

export const createTransferController = async (req: Request, res: Response) => {
  try {
    const transfer = await createTransfer({ ...req.body, userId: req.user._id })
    res.status(201).json({ success: true, data: transfer })
  } catch (error: any) {
    res.status(400).json({ error: error.message })
  }
}

export const deleteTransferController = async (req: Request, res: Response) => {
  try {
    const result = await deleteTransfer(req.params.id)
    res.json({ success: true, ...result })
  } catch (error: any) {
    res.status(400).json({ error: error.message })
  }
}
