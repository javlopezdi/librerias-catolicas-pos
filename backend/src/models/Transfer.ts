// src/models/Transfer.ts (actualizado con hooks de auditoría)
import { Schema, model, Document, PaginateModel } from 'mongoose'
import mongoosePaginate from 'mongoose-paginate-v2'
import AuditLog from './AuditLog'

interface ITransferItem {
  productId: Schema.Types.ObjectId
  quantity: number
}

interface ITransfer extends Document {
  userId: Schema.Types.ObjectId
  fromLocationId: Schema.Types.ObjectId
  toLocationId: Schema.Types.ObjectId
  items: ITransferItem[] // Embedded array
  date: Date
  status: 'completed' | 'pending'
}

const transferSchema = new Schema<ITransfer>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  fromLocationId: {
    type: Schema.Types.ObjectId,
    ref: 'Location',
    required: true,
  },
  toLocationId: {
    type: Schema.Types.ObjectId,
    ref: 'Location',
    required: true,
  },
  items: [
    {
      productId: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
      },
      quantity: { type: Number, required: true },
    },
  ],
  date: { type: Date, default: Date.now },
  status: {
    type: String,
    enum: ['completed', 'pending'],
    default: 'completed',
  },
})

// Hook para creación
transferSchema.post('save', async function (doc: ITransfer) {
  if (this.isNew) {
    try {
      const auditLog = new AuditLog({
        userId: doc.userId,
        action: 'Transfer created',
        details: JSON.stringify({
          transferId: doc._id,
          fromLocationId: doc.fromLocationId,
          toLocationId: doc.toLocationId,
        }),
        ip: 'unknown',
        date: new Date(),
      })
      await auditLog.save()
    } catch (err) {
      console.error('Error in Transfer audit hook:', err)
    }
  }
})

// Hook para eliminación
transferSchema.post(
  'deleteOne',
  { document: true, query: false },
  async function (doc: ITransfer) {
    try {
      const auditLog = new AuditLog({
        userId: doc.userId,
        action: 'Transfer deleted',
        details: JSON.stringify({ transferId: doc._id }),
        ip: 'unknown',
        date: new Date(),
      })
      await auditLog.save()
    } catch (err) {
      console.error('Error in Transfer delete audit hook:', err)
    }
  }
)

transferSchema.plugin(mongoosePaginate)

export default model<ITransfer, PaginateModel<ITransfer>>(
  'Transfer',
  transferSchema
)
