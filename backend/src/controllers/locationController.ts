// src/controllers/locationController.ts
import { Request, Response } from 'express'
import {
  getLocations,
  getLocationById,
  createLocation,
  updateLocation,
  deleteLocation,
} from '../services/locationService'

export const getLocationsController = async (req: Request, res: Response) => {
  try {
    const locations = await getLocations()
    res.json({ success: true, data: locations })
  } catch (error: any) {
    throw error
  }
}

export const getLocationByIdController = async (
  req: Request,
  res: Response
) => {
  try {
    const location = await getLocationById(req.params.id)
    if (!location)
      return res.status(404).json({ error: 'Ubicación no encontrada' })
    res.json({ success: true, data: location })
  } catch (error: any) {
    throw error
  }
}

export const createLocationController = async (req: Request, res: Response) => {
  try {
    const location = await createLocation(req.body)
    res.status(201).json({ success: true, data: location })
  } catch (error: any) {
    throw error
  }
}

export const updateLocationController = async (req: Request, res: Response) => {
  try {
    const location = await updateLocation(req.params.id, req.body)
    if (!location)
      return res.status(404).json({ error: 'Ubicación no encontrada' })
    res.json({ success: true, data: location })
  } catch (error: any) {
    throw error
  }
}

export const deleteLocationController = async (req: Request, res: Response) => {
  try {
    const location = await deleteLocation(req.params.id)
    if (!location)
      return res.status(404).json({ error: 'Ubicación no encontrada' })
    res.json({ success: true, message: 'Ubicación eliminada' })
  } catch (error: any) {
    throw error
  }
}
