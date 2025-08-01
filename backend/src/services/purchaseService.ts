// src/services/purchaseService.ts
import Purchase from '../models/Purchase'
import Stock from '../models/Stock'
import Supplier from '../models/Supplier'
import mongoose from 'mongoose'

export const getPurchases = async (query: any) => {
  const { supplierId, fromDate, toDate, page = 1, limit = 10 } = query
  const filters: any = {}
  if (supplierId) filters.supplierId = supplierId
  if (fromDate) filters.date = { ...filters.date, $gte: new Date(fromDate) }
  if (toDate) filters.date = { ...filters.date, $lte: new Date(toDate) }
  const options = {
    page: parseInt(page),
    limit: parseInt(limit),
    sort: { date: -1 },
    populate: 'supplierId userId locationId',
  }
  return await Purchase.paginate(filters, options)
}

export const getPurchaseById = async (id: string) => {
  return await Purchase.findById(id).populate('supplierId userId locationId')
}

export const createPurchase = async (data: any) => {
  const session = await mongoose.startSession()
  session.startTransaction()
  try {
    const { supplierId, userId, locationId, items, total } = data

    // Actualizar stock para cada item
    await Promise.all(
      items.map(async (item: any) => {
        await Stock.findOneAndUpdate(
          { productId: item.productId, locationId },
          { $inc: { quantity: item.quantity } },
          { upsert: true, new: true, session }
        )
      })
    )

    // Crear Purchase
    const purchase = new Purchase({
      supplierId,
      userId,
      locationId,
      items,
      total,
      date: new Date(),
    })
    await purchase.save({ session })

    // Actualizar Supplier
    await Supplier.findByIdAndUpdate(
      supplierId,
      { $inc: { totalArticles: items.length }, lastPurchase: new Date() },
      { session }
    )

    await session.commitTransaction()
    return purchase
  } catch (error) {
    await session.abortTransaction()
    throw error
  } finally {
    session.endSession()
  }
}

export const deletePurchase = async (id: string) => {
  const session = await mongoose.startSession()
  session.startTransaction()
  try {
    const purchase = await Purchase.findById(id)
    if (!purchase) throw new Error('Compra no encontrada')

    // Revertir stock
    await Promise.all(
      purchase.items.map(async (item: any) => {
        await Stock.findOneAndUpdate(
          { productId: item.productId, locationId: purchase.locationId },
          { $inc: { quantity: -item.quantity } },
          { session }
        )
      })
    )

    // Revertir Supplier
    await Supplier.findByIdAndUpdate(
      purchase.supplierId,
      { $inc: { totalArticles: -purchase.items.length } },
      { session }
    )

    await purchase.deleteOne({ session })

    await session.commitTransaction()
    return { message: 'Compra eliminada y stock revertido' }
  } catch (error) {
    await session.abortTransaction()
    throw error
  } finally {
    session.endSession()
  }
}
