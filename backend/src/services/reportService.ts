// src/services/reportService.ts
import Sale from '../models/Sale'
import SaleItem from '../models/SaleItem'
import {
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
} from 'date-fns' // Asumir instalación de date-fns para manejo de fechas

export const getSalesByDay = async (
  query: any,
  userId: string,
  role: string
) => {
  const { fromDate, toDate, period = 'daily' } = query
  let startDate = fromDate ? new Date(fromDate) : new Date()
  let endDate = toDate ? new Date(toDate) : new Date()

  switch (period) {
    case 'weekly':
      startDate = startOfWeek(startDate)
      endDate = endOfWeek(endDate)
      break
    case 'monthly':
      startDate = startOfMonth(startDate)
      endDate = endOfMonth(endDate)
      break
    // daily por defecto
  }

  const match: any = {
    date: { $gte: startDate, $lte: endDate },
  }
  if (role === 'Vendedor') {
    match.userId = userId
  }

  const sales = await Sale.aggregate([
    { $match: match },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$date' } },
        totalSales: { $sum: '$total' },
        cashSales: {
          $sum: { $cond: [{ $eq: ['$type', 'cash'] }, '$total', 0] },
        },
        creditSales: {
          $sum: { $cond: [{ $eq: ['$type', 'credit'] }, '$total', 0] },
        },
        layawaySales: {
          $sum: { $cond: [{ $eq: ['$type', 'layaway'] }, '$total', 0] },
        },
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ])

  return sales
}

export const getTopProducts = async (
  query: any,
  userId: string,
  role: string
) => {
  const { fromDate, toDate, limit = 10 } = query
  const match: any = {}
  if (fromDate) match.date = { ...match.date, $gte: new Date(fromDate) }
  if (toDate) match.date = { ...match.date, $lte: new Date(toDate) }
  if (role === 'Vendedor') {
    match.userId = userId
  }

  const topProducts = await Sale.aggregate([
    { $match: match },
    { $unwind: '$items' },
    {
      $lookup: {
        from: 'saleitems',
        localField: 'items',
        foreignField: '_id',
        as: 'itemDetails',
      },
    },
    { $unwind: '$itemDetails' },
    {
      $group: {
        _id: '$itemDetails.productId',
        totalQuantity: { $sum: '$itemDetails.quantity' },
        totalRevenue: { $sum: '$itemDetails.subtotal' },
      },
    },
    {
      $lookup: {
        from: 'products',
        localField: '_id',
        foreignField: '_id',
        as: 'product',
      },
    },
    { $unwind: '$product' },
    { $sort: { totalRevenue: -1 } },
    { $limit: parseInt(limit) },
    {
      $project: {
        _id: 0,
        productId: '$_id',
        name: '$product.name',
        totalQuantity: 1,
        totalRevenue: 1,
      },
    },
  ])

  return topProducts
}

export const getTotalIncome = async (
  query: any,
  userId: string,
  role: string
) => {
  const { fromDate, toDate } = query
  const match: any = {}
  if (fromDate) match.date = { ...match.date, $gte: new Date(fromDate) }
  if (toDate) match.date = { ...match.date, $lte: new Date(toDate) }
  if (role === 'Vendedor') {
    match.userId = userId
  }

  const income = await Sale.aggregate([
    { $match: match },
    {
      $group: {
        _id: null,
        totalIncome: { $sum: '$total' },
        cashIncome: {
          $sum: { $cond: [{ $eq: ['$type', 'cash'] }, '$total', 0] },
        },
        creditIncome: {
          $sum: { $cond: [{ $eq: ['$type', 'credit'] }, '$total', 0] },
        },
        layawayIncome: {
          $sum: { $cond: [{ $eq: ['$type', 'layaway'] }, '$total', 0] },
        },
      },
    },
  ])

  return (
    income[0] || {
      totalIncome: 0,
      cashIncome: 0,
      creditIncome: 0,
      layawayIncome: 0,
    }
  )
}

export const getCreditLayawayReports = async (
  query: any,
  userId: string,
  role: string
) => {
  const { fromDate, toDate, status, page = 1, limit = 10 } = query
  const match: any = {
    type: { $in: ['credit', 'layaway'] },
  }
  if (fromDate) match.date = { ...match.date, $gte: new Date(fromDate) }
  if (toDate) match.date = { ...match.date, $lte: new Date(toDate) }
  if (status) match.status = status
  if (role === 'Vendedor') {
    match.userId = userId
  }

  const options = {
    page: parseInt(page),
    limit: parseInt(limit),
    sort: { date: -1 },
    populate: 'userId customerId',
  }

  return await Sale.paginate(match, options)
}
