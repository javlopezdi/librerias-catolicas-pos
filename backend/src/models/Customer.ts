import { Schema, model, Document } from 'mongoose'

interface ICustomer extends Document {
  name: string
  email: string
  phone: string
  totalPurchases: number
  lastPurchase?: Date
  createdAt: Date
  updatedAt: Date
}

const customerSchema = new Schema<ICustomer>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    totalPurchases: { type: Number, default: 0 },
    lastPurchase: { type: Date },
  },
  { timestamps: true }
)

export default model<ICustomer>('Customer', customerSchema)
