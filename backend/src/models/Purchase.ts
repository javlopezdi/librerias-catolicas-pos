// src/models/Purchase.ts (actualizado con hooks de auditoría)
import { Schema, model, Document, PaginateModel } from 'mongoose'
import mongoosePaginate from 'mongoose-paginate-v2'
import AuditLog from './AuditLog'

interface IPurchaseItem {
  productId: Schema.Types.ObjectId
  quantity: number
  price: number
}

interface IPurchase extends Document {
  supplierId: Schema.Types.ObjectId
  userId: Schema.Types.ObjectId
  locationId: Schema.Types.ObjectId
  items: IPurchaseItem[] // Embedded array
  total: number
  date: Date
}

const purchaseSchema = new Schema<IPurchase>({
  supplierId: { type: Schema.Types.ObjectId, ref: 'Supplier', required: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  locationId: { type: Schema.Types.ObjectId, ref: 'Location', required: true },
  items: [
    {
      productId: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
      },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true },
    },
  ],
  total: { type: Number, required: true },
  date: { type: Date, default: Date.now },
})

// Hook para creación
purchaseSchema.post('save', async function (doc: IPurchase) {
  if (this.isNew) {
    try {
      const auditLog = new AuditLog({
        userId: doc.userId,
        action: 'Purchase created',
        details: JSON.stringify({
          purchaseId: doc._id,
          total: doc.total,
          supplierId: doc.supplierId,
        }),
        ip: 'unknown',
        date: new Date(),
      })
      await auditLog.save()
    } catch (err) {
      console.error('Error in Purchase audit hook:', err)
    }
  }
})

// Hook para eliminación
purchaseSchema.post(
  'deleteOne',
  { document: true, query: false },
  async function (doc: IPurchase) {
    try {
      const auditLog = new AuditLog({
        userId: doc.userId,
        action: 'Purchase deleted',
        details: JSON.stringify({ purchaseId: doc._id }),
        ip: 'unknown',
        date: new Date(),
      })
      await auditLog.save()
    } catch (err) {
      console.error('Error in Purchase delete audit hook:', err)
    }
  }
)

purchaseSchema.plugin(mongoosePaginate)

export default model<IPurchase, PaginateModel<IPurchase>>(
  'Purchase',
  purchaseSchema
)
