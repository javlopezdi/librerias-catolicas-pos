// src/services/stockService.ts
import Stock from '../models/Stock'
import Product from '../models/Product' // Para validaciones
import Location from '../models/Location'

export const getStocks = async (query: any) => {
  const { productId, locationId } = query
  const filters: any = {}
  if (productId) filters.productId = productId
  if (locationId) filters.locationId = locationId
  return await Stock.find(filters).populate('productId locationId')
}

export const getStockById = async (id: string) => {
  return await Stock.findById(id).populate('productId locationId')
}

export const createOrUpdateStock = async (data: any) => {
  const { productId, locationId, quantity, minStockThreshold } = data
  return await Stock.findOneAndUpdate(
    { productId, locationId },
    { quantity, minStockThreshold },
    { upsert: true, new: true }
  )
}

export const adjustStock = async (
  productId: string,
  locationId: string,
  adjustment: number
) => {
  return await Stock.findOneAndUpdate(
    { productId, locationId },
    { $inc: { quantity: adjustment } },
    { new: true }
  )
}

export const deleteStock = async (id: string) => {
  return await Stock.findByIdAndDelete(id)
}
