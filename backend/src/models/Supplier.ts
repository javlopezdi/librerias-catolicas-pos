import { Schema, model, Document } from 'mongoose'

interface ISupplier extends Document {
  name: string
  contact: string
  email: string
  totalArticles: number
  lastPurchase?: Date
  createdAt: Date
  updatedAt: Date
}

const supplierSchema = new Schema<ISupplier>(
  {
    name: { type: String, required: true, unique: true },
    contact: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    totalArticles: { type: Number, default: 0 },
    lastPurchase: { type: Date },
  },
  { timestamps: true }
)

export default model<ISupplier>('Supplier', supplierSchema)
