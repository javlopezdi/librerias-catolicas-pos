// src/controllers/exportController.ts (actualizado con casts temporales para resolver TS2339)
import { Request, Response } from 'express'
import { exportReportToPDF, exportReportToCSV } from '../services/exportService'

export const exportReportController = async (req: Request, res: Response) => {
  try {
    if (!(req as any).user || !(req as any).user._id) {
      return res.status(401).json({ error: 'Usuario no autenticado' })
    }
    const { reportType, format } = req.params
    let data: Buffer | string
    if (format === 'pdf') {
      data = await exportReportToPDF(
        reportType,
        req.query,
        (req as any).user._id.toString(),
        (req as any).user.role
      )
    } else {
      data = await exportReportToCSV(
        reportType,
        req.query,
        (req as any).user._id.toString(),
        (req as any).user.role
      )
    }

    const filename = `reporte_${reportType}.${format}`
    res.setHeader('Content-Disposition', `attachment; filename=${filename}`)
    res.setHeader(
      'Content-Type',
      format === 'pdf' ? 'application/pdf' : 'text/csv'
    )
    res.send(data)
  } catch (error: any) {
    res.status(400).json({ error: error.message })
  }
}
