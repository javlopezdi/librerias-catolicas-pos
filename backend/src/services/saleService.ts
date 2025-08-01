// src/services/saleService.ts
import Sale from '../models/Sale'
import SaleItem from '../models/SaleItem'
import Stock from '../models/Stock'
import User from '../models/User'
import Location from '../models/Location'
import mongoose from 'mongoose'

export const getSales = async (query: any) => {
  const { userId, locationId, fromDate, toDate, page = 1, limit = 10 } = query
  const filters: any = {}
  if (userId) filters.userId = userId
  if (locationId) filters.locationId = locationId
  if (fromDate) filters.date = { ...filters.date, $gte: new Date(fromDate) }
  if (toDate) filters.date = { ...filters.date, $lte: new Date(toDate) }
  const options = {
    page: parseInt(page),
    limit: parseInt(limit),
    sort: { date: -1 },
    populate: 'userId locationId customerId items', // Populate referencias
  }
  return await Sale.paginate(filters, options)
}

export const getSaleById = async (id: string) => {
  return await Sale.findById(id).populate('userId locationId customerId items')
}

export const createSale = async (data: any) => {
  const session = await mongoose.startSession()
  session.startTransaction()
  try {
    const {
      userId,
      locationId,
      customerId,
      items,
      subtotal,
      discount,
      total,
      type,
      paymentMethod,
      status,
    } = data

    // Crear SaleItems
    const saleItems = await Promise.all(
      items.map(async (item: any) => {
        const saleItem = new SaleItem({
          productId: item.productId,
          quantity: item.quantity,
          priceAtSale: item.priceAtSale,
          subtotal: item.quantity * item.priceAtSale,
        })
        await saleItem.save({ session })
        // Actualizar stock
        const stock = await Stock.findOneAndUpdate(
          { productId: item.productId, locationId },
          { $inc: { quantity: -item.quantity } },
          { new: true, session }
        )
        if (!stock || stock.quantity < 0) {
          throw new Error('Stock insuficiente para el producto')
        }
        return saleItem._id
      })
    )

    // Crear Sale
    const sale = new Sale({
      userId,
      locationId,
      customerId,
      items: saleItems,
      subtotal,
      discount,
      total,
      type,
      paymentMethod,
      date: new Date(),
      status,
    })
    await sale.save({ session })

    // Actualizar totalSales en User y Location
    await User.findByIdAndUpdate(
      userId,
      { $inc: { totalSales: total }, lastSale: new Date() },
      { session }
    )
    await Location.findByIdAndUpdate(
      locationId,
      { $inc: { totalSales: total, monthlySales: total } },
      { session }
    ) // Asumir monthlySales se resetea mensualmente via cron o similar

    await session.commitTransaction()
    return sale.populate('items')
  } catch (error) {
    await session.abortTransaction()
    throw error
  } finally {
    session.endSession()
  }
}

export const updateSale = async (id: string, data: any) => {
  // Para actualizaciones como cambiar status en créditos/apartados, sin reversión de stock por ahora
  return await Sale.findByIdAndUpdate(id, data, { new: true }).populate('items')
}

export const deleteSale = async (id: string) => {
  const session = await mongoose.startSession()
  session.startTransaction()
  try {
    const sale = await Sale.findById(id).populate('items')
    if (!sale) throw new Error('Venta no encontrada')

    // Revertir stock
    await Promise.all(
      sale.items.map(async (item: any) => {
        await Stock.findOneAndUpdate(
          { productId: item.productId, locationId: sale.locationId },
          { $inc: { quantity: item.quantity } },
          { session }
        )
      })
    )

    // Revertir totalSales en User y Location
    await User.findByIdAndUpdate(
      sale.userId,
      { $inc: { totalSales: -sale.total } },
      { session }
    )
    await Location.findByIdAndUpdate(
      sale.locationId,
      { $inc: { totalSales: -sale.total, monthlySales: -sale.total } },
      { session }
    )

    // Eliminar SaleItems
    await SaleItem.deleteMany({ _id: { $in: sale.items } }, { session })

    // Eliminar Sale
    await sale.deleteOne({ session })

    await session.commitTransaction()
    return { message: 'Venta eliminada y stock revertido' }
  } catch (error) {
    await session.abortTransaction()
    throw error
  } finally {
    session.endSession()
  }
}
