// src/services/auditService.ts
import AuditLog from '../models/AuditLog'

export const getAuditLogs = async (query: any) => {
  const { userId, action, fromDate, toDate, page = 1, limit = 10 } = query
  const filters: any = {}
  if (userId) filters.userId = userId
  if (action) filters.action = { $regex: action, $options: 'i' }
  if (fromDate) filters.date = { ...filters.date, $gte: new Date(fromDate) }
  if (toDate) filters.date = { ...filters.date, $lte: new Date(toDate) }
  const options = {
    page: parseInt(page),
    limit: parseInt(limit),
    sort: { date: -1 },
    populate: 'userId', // Populate user details
  }
  return await AuditLog.paginate(filters, options)
}
