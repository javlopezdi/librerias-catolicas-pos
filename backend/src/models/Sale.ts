// src/models/Sale.ts (actualizado con hooks de auditoría)
import { Schema, model, Document, PaginateModel } from 'mongoose'
import mongoosePaginate from 'mongoose-paginate-v2'
import AuditLog from './AuditLog' // Importar AuditLog para usarlo en hooks

interface ISale extends Document {
  userId: Schema.Types.ObjectId
  locationId: Schema.Types.ObjectId
  customerId?: Schema.Types.ObjectId
  items: Schema.Types.ObjectId[] // Referencias a SaleItem
  subtotal: number
  discount: number
  total: number
  type: 'cash' | 'credit' | 'layaway'
  paymentMethod?: string
  date: Date
  status: 'completed' | 'pending'
}

const saleSchema = new Schema<ISale>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  locationId: { type: Schema.Types.ObjectId, ref: 'Location', required: true },
  customerId: { type: Schema.Types.ObjectId, ref: 'Customer' },
  items: [{ type: Schema.Types.ObjectId, ref: 'SaleItem' }],
  subtotal: { type: Number, required: true },
  discount: { type: Number, default: 0 },
  total: { type: Number, required: true },
  type: { type: String, enum: ['cash', 'credit', 'layaway'], required: true },
  paymentMethod: { type: String },
  date: { type: Date, default: Date.now },
  status: {
    type: String,
    enum: ['completed', 'pending'],
    default: 'completed',
  },
})

// Hook para creación (post save)
saleSchema.post('save', async function (doc: ISale) {
  if (this.isNew) {
    try {
      const auditLog = new AuditLog({
        userId: doc.userId,
        action: 'Sale created',
        details: JSON.stringify({
          saleId: doc._id,
          total: doc.total,
          type: doc.type,
        }),
        ip: 'unknown', // Idealmente, pasar IP desde el request; por ahora placeholder
        date: new Date(),
      })
      await auditLog.save()
    } catch (err) {
      console.error('Error in Sale audit hook:', err)
    }
  }
})

// Hook para actualización (post findOneAndUpdate)
saleSchema.post('findOneAndUpdate', async function (doc: ISale | null) {
  if (doc) {
    try {
      const auditLog = new AuditLog({
        userId: doc.userId, // Asumir userId disponible; ajustar si es necesario
        action: 'Sale updated',
        details: JSON.stringify({
          saleId: doc._id,
          updatedFields: this.getUpdate(),
        }),
        ip: 'unknown',
        date: new Date(),
      })
      await auditLog.save()
    } catch (err) {
      console.error('Error in Sale update audit hook:', err)
    }
  }
})

// Hook para eliminación (post deleteOne)
saleSchema.post(
  'deleteOne',
  { document: true, query: false },
  async function (doc: ISale) {
    try {
      const auditLog = new AuditLog({
        userId: doc.userId,
        action: 'Sale deleted',
        details: JSON.stringify({ saleId: doc._id }),
        ip: 'unknown',
        date: new Date(),
      })
      await auditLog.save()
    } catch (err) {
      console.error('Error in Sale delete audit hook:', err)
    }
  }
)

saleSchema.plugin(mongoosePaginate)

export default model<ISale, PaginateModel<ISale>>('Sale', saleSchema)
