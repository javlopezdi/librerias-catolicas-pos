import { Schema, model, Document } from 'mongoose'

interface IStock extends Document {
  productId: Schema.Types.ObjectId
  locationId: Schema.Types.ObjectId
  quantity: number
  minStockThreshold: number
  updatedAt: Date
}

const stockSchema = new Schema<IStock>(
  {
    productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    locationId: {
      type: Schema.Types.ObjectId,
      ref: 'Location',
      required: true,
    },
    quantity: { type: Number, required: true, default: 0 },
    minStockThreshold: { type: Number, default: 0 },
  },
  { timestamps: { createdAt: false, updatedAt: true } }
) // Solo updatedAt, ya que no hay createdAt en la lista

export default model<IStock>('Stock', stockSchema)
