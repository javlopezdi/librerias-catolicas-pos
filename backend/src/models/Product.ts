// src/models/Product.ts (actualizado con hooks de auditoría, para creaciones y actualizaciones de productos)
import { Schema, model, Document, PaginateModel } from 'mongoose'
import mongoosePaginate from 'mongoose-paginate-v2'
import AuditLog from './AuditLog'

interface IProduct extends Document {
  name: string
  barcode: string
  categoryId: Schema.Types.ObjectId
  price: number
  supplierId?: Schema.Types.ObjectId
  description?: string
  createdAt: Date
  updatedAt: Date
}

const productSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true },
    barcode: { type: String, required: true, unique: true },
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    price: { type: Number, required: true },
    supplierId: { type: Schema.Types.ObjectId, ref: 'Supplier' },
    description: { type: String },
  },
  { timestamps: true }
)

// Hook para creación
productSchema.post('save', async function (doc: IProduct) {
  if (this.isNew) {
    try {
      const auditLog = new AuditLog({
        userId: 'system', // Asumir 'system' si no hay userId; ajustar para pasar desde service si es necesario
        action: 'Product created',
        details: JSON.stringify({ productId: doc._id, name: doc.name }),
        ip: 'unknown',
        date: new Date(),
      })
      await auditLog.save()
    } catch (err) {
      console.error('Error in Product audit hook:', err)
    }
  }
})

// Hook para actualización
productSchema.post('findOneAndUpdate', async function (doc: IProduct | null) {
  if (doc) {
    try {
      const auditLog = new AuditLog({
        userId: 'system',
        action: 'Product updated',
        details: JSON.stringify({
          productId: doc._id,
          updatedFields: this.getUpdate(),
        }),
        ip: 'unknown',
        date: new Date(),
      })
      await auditLog.save()
    } catch (err) {
      console.error('Error in Product update audit hook:', err)
    }
  }
})

// Hook para eliminación
productSchema.post(
  'deleteOne',
  { document: true, query: false },
  async function (doc: IProduct) {
    try {
      const auditLog = new AuditLog({
        userId: 'system',
        action: 'Product deleted',
        details: JSON.stringify({ productId: doc._id }),
        ip: 'unknown',
        date: new Date(),
      })
      await auditLog.save()
    } catch (err) {
      console.error('Error in Product delete audit hook:', err)
    }
  }
)

productSchema.plugin(mongoosePaginate)

export default model<IProduct, PaginateModel<IProduct>>(
  'Product',
  productSchema
)
