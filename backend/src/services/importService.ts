// src/services/importService.ts (nuevo servicio para imports CSV)
import csvParser from 'csv-parser'
import { Readable } from 'stream'
import Product from '../models/Product'
import Stock from '../models/Stock'
import Customer from '../models/Customer'
import mongoose from 'mongoose'

export const importProductsCSV = async (
  fileBuffer: Buffer,
  locationId: string
) => {
  const results: any[] = []
  const stream = Readable.from(fileBuffer.toString())

  return new Promise((resolve, reject) => {
    stream
      .pipe(csvParser())
      .on('data', (data) => results.push(data))
      .on('end', async () => {
        const session = await mongoose.startSession()
        session.startTransaction()
        try {
          for (const row of results) {
            // Asumir columnas CSV: name, barcode, categoryId, price, supplierId, description, quantity (para stock inicial)
            const product = await Product.findOneAndUpdate(
              { barcode: row.barcode },
              {
                name: row.name,
                categoryId: row.categoryId,
                price: parseFloat(row.price),
                supplierId: row.supplierId || null,
                description: row.description || '',
              },
              { upsert: true, new: true, session }
            )

            // Actualizar stock si quantity está presente
            if (row.quantity && locationId) {
              await Stock.findOneAndUpdate(
                { productId: product._id, locationId },
                { quantity: parseInt(row.quantity) },
                { upsert: true, new: true, session }
              )
            }
          }
          await session.commitTransaction()
          resolve({
            message: 'Productos importados exitosamente',
            count: results.length,
          })
        } catch (error) {
          await session.abortTransaction()
          reject(error)
        } finally {
          session.endSession()
        }
      })
      .on('error', reject)
  })
}

export const importCustomersCSV = async (fileBuffer: Buffer) => {
  const results: any[] = []
  const stream = Readable.from(fileBuffer.toString())

  return new Promise((resolve, reject) => {
    stream
      .pipe(csvParser())
      .on('data', (data) => results.push(data))
      .on('end', async () => {
        const session = await mongoose.startSession()
        session.startTransaction()
        try {
          for (const row of results) {
            // Asumir columnas CSV: name, email, phone
            await Customer.findOneAndUpdate(
              { email: row.email },
              {
                name: row.name,
                phone: row.phone,
              },
              { upsert: true, new: true, session }
            )
          }
          await session.commitTransaction()
          resolve({
            message: 'Clientes importados exitosamente',
            count: results.length,
          })
        } catch (error) {
          await session.abortTransaction()
          reject(error)
        } finally {
          session.endSession()
        }
      })
      .on('error', reject)
  })
}
