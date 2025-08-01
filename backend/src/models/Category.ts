import { Schema, model, Document } from 'mongoose'

interface ICategory extends Document {
  name: string
  description?: string
  createdAt: Date
  updatedAt: Date
}

const categorySchema = new Schema<ICategory>(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String },
  },
  { timestamps: true }
)

export default model<ICategory>('Category', categorySchema)
