// src/controllers/auditController.ts
import { Request, Response } from 'express'
import { getAuditLogs } from '../services/auditService'

export const getAuditLogsController = async (req: Request, res: Response) => {
  try {
    const auditLogs = await getAuditLogs(req.query)
    res.json({ success: true, data: auditLogs })
  } catch (error: any) {
    throw error
  }
}
