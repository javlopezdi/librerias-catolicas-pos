import { Schema, model, Document } from 'mongoose'

interface ILocation extends Document {
  name: string
  city: string
  address: string
  totalSales: number
  monthlySales: number
  createdAt: Date
  updatedAt: Date
}

const locationSchema = new Schema<ILocation>(
  {
    name: { type: String, required: true, unique: true },
    city: { type: String, required: true },
    address: { type: String, required: true },
    totalSales: { type: Number, default: 0 },
    monthlySales: { type: Number, default: 0 },
  },
  { timestamps: true }
)

export default model<ILocation>('Location', locationSchema)
