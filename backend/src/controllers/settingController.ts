// src/controllers/settingController.ts
import { Request, Response } from 'express'
import {
  getSettings,
  getSettingByType,
  createOrUpdateSetting,
  deleteSetting,
} from '../services/settingService'

export const getSettingsController = async (req: Request, res: Response) => {
  try {
    const settings = await getSettings()
    res.json({ success: true, data: settings })
  } catch (error: any) {
    throw error
  }
}

export const getSettingByTypeController = async (
  req: Request,
  res: Response
) => {
  try {
    const setting = await getSettingByType(req.params.type)
    if (!setting)
      return res.status(404).json({ error: 'Configuración no encontrada' })
    res.json({ success: true, data: setting })
  } catch (error: any) {
    throw error
  }
}

export const createOrUpdateSettingController = async (
  req: Request,
  res: Response
) => {
  try {
    const { type } = req.params
    const setting = await createOrUpdateSetting(type, req.body.data)
    res.json({ success: true, data: setting })
  } catch (error: any) {
    throw error
  }
}

export const deleteSettingController = async (req: Request, res: Response) => {
  try {
    const result = await deleteSetting(req.params.type)
    if (result.deletedCount === 0)
      return res.status(404).json({ error: 'Configuración no encontrada' })
    res.json({ success: true, message: 'Configuración eliminada' })
  } catch (error: any) {
    throw error
  }
}
