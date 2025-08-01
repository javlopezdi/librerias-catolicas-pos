// src/services/locationService.ts
import Location from '../models/Location'

export const getLocations = async () => {
  return await Location.find().sort({ name: 1 })
}

export const getLocationById = async (id: string) => {
  return await Location.findById(id)
}

export const createLocation = async (data: any) => {
  const location = new Location(data)
  return await location.save()
}

export const updateLocation = async (id: string, data: any) => {
  return await Location.findByIdAndUpdate(id, data, { new: true })
}

export const deleteLocation = async (id: string) => {
  return await Location.findByIdAndDelete(id)
}
