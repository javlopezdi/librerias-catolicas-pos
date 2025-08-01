// src/services/transferService.ts
import Transfer from '../models/Transfer'
import Stock from '../models/Stock'
import mongoose from 'mongoose'

export const getTransfers = async (query: any) => {
  const {
    fromLocationId,
    toLocationId,
    fromDate,
    toDate,
    page = 1,
    limit = 10,
  } = query
  const filters: any = {}
  if (fromLocationId) filters.fromLocationId = fromLocationId
  if (toLocationId) filters.toLocationId = toLocationId
  if (fromDate) filters.date = { ...filters.date, $gte: new Date(fromDate) }
  if (toDate) filters.date = { ...filters.date, $lte: new Date(toDate) }
  const options = {
    page: parseInt(page),
    limit: parseInt(limit),
    sort: { date: -1 },
    populate: 'userId fromLocationId toLocationId',
  }
  return await Transfer.paginate(filters, options)
}

export const getTransferById = async (id: string) => {
  return await Transfer.findById(id).populate(
    'userId fromLocationId toLocationId'
  )
}

export const createTransfer = async (data: any) => {
  const session = await mongoose.startSession()
  session.startTransaction()
  try {
    const { userId, fromLocationId, toLocationId, items } = data

    // Ajustar stock
    await Promise.all(
      items.map(async (item: any) => {
        // Restar de origen
        const fromStock = await Stock.findOneAndUpdate(
          { productId: item.productId, locationId: fromLocationId },
          { $inc: { quantity: -item.quantity } },
          { new: true, session }
        )
        if (!fromStock || fromStock.quantity < 0)
          throw new Error('Stock insuficiente en origen')

        // Agregar a destino
        await Stock.findOneAndUpdate(
          { productId: item.productId, locationId: toLocationId },
          { $inc: { quantity: item.quantity } },
          { upsert: true, new: true, session }
        )
      })
    )

    // Crear Transfer
    const transfer = new Transfer({
      userId,
      fromLocationId,
      toLocationId,
      items,
      date: new Date(),
      status: 'completed',
    })
    await transfer.save({ session })

    await session.commitTransaction()
    return transfer
  } catch (error) {
    await session.abortTransaction()
    throw error
  } finally {
    session.endSession()
  }
}

export const deleteTransfer = async (id: string) => {
  const session = await mongoose.startSession()
  session.startTransaction()
  try {
    const transfer = await Transfer.findById(id)
    if (!transfer) throw new Error('Traslado no encontrado')

    // Revertir stock
    await Promise.all(
      transfer.items.map(async (item: any) => {
        // Restar de destino
        await Stock.findOneAndUpdate(
          { productId: item.productId, locationId: transfer.toLocationId },
          { $inc: { quantity: -item.quantity } },
          { session }
        )
        // Agregar a origen
        await Stock.findOneAndUpdate(
          { productId: item.productId, locationId: transfer.fromLocationId },
          { $inc: { quantity: item.quantity } },
          { session }
        )
      })
    )

    await transfer.deleteOne({ session })

    await session.commitTransaction()
    return { message: 'Traslado eliminado y stock revertido' }
  } catch (error) {
    await session.abortTransaction()
    throw error
  } finally {
    session.endSession()
  }
}
