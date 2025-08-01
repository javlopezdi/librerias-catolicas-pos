// src/services/settingService.ts
import Setting from '../models/Setting'

export const getSettings = async () => {
  return await Setting.find()
}

export const getSettingByType = async (type: string) => {
  return await Setting.findOne({ type })
}

export const createOrUpdateSetting = async (type: string, data: any) => {
  return await Setting.findOneAndUpdate(
    { type },
    { data },
    { upsert: true, new: true }
  )
}

export const deleteSetting = async (type: string) => {
  return await Setting.deleteOne({ type })
}
