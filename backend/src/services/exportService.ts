// src/services/exportService.ts (actualizado para resolver el error de tipos y hacer async correcto)
import PDFDocument from 'pdfkit'
import { Readable } from 'stream'
import {
  getSalesByDay,
  getTopProducts,
  getTotalIncome,
  getCreditLayawayReports,
} from './reportService' // Reusar servicios de reportes

export const exportReportToPDF = async (
  reportType: string,
  query: any,
  userId: string,
  role: string
): Promise<Buffer> => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument()
    const buffers: Buffer[] = []

    doc.on('data', (chunk: Buffer) => buffers.push(chunk))
    doc.on('end', () => resolve(Buffer.concat(buffers)))
    doc.on('error', reject)

    // Encabezado
    doc.fontSize(20).text('Reporte de Librerías Católicas', 100, 100)
    doc
      .fontSize(12)
      .text(`Fecha: ${new Date().toLocaleDateString('es-MX')}`, 100, 130)

    // Contenido basado en tipo de reporte (asincrónico, pero como es aggregate, await dentro)
    ;(async () => {
      try {
        let data: any
        switch (reportType) {
          case 'sales-by-day':
            data = await getSalesByDay(query, userId, role)
            doc.text('Ventas por Día', 100, 160)
            data.forEach((item: any, index: number) => {
              doc.text(
                `${item._id}: Total ${item.totalSales}, Conteo ${item.count}`,
                100,
                180 + index * 20
              )
            })
            break
          case 'top-products':
            data = await getTopProducts(query, userId, role)
            doc.text('Productos Top', 100, 160)
            data.forEach((item: any, index: number) => {
              doc.text(
                `${item.name}: Cantidad ${item.totalQuantity}, Ingresos ${item.totalRevenue}`,
                100,
                180 + index * 20
              )
            })
            break
          // Agregar otros tipos similarmente
          default:
            throw new Error('Tipo de reporte no soportado')
        }
        doc.end()
      } catch (error) {
        reject(error)
      }
    })()
  })
}

export const exportReportToCSV = async (
  reportType: string,
  query: any,
  userId: string,
  role: string
): Promise<string> => {
  let data: any
  let csvContent = 'Reporte,Tipo,Fecha\n' // Encabezado CSV

  switch (reportType) {
    case 'sales-by-day':
      data = await getSalesByDay(query, userId, role)
      data.forEach((item: any) => {
        csvContent += `${item._id},${item.totalSales},${item.count}\n`
      })
      break
    // Similar para otros
  }

  return csvContent
}
