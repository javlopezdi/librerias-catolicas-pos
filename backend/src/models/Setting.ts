import { Schema, model, Document } from 'mongoose'

interface ISetting extends Document {
  type: string
  data: object // Flexible
  updatedAt: Date
}

const settingSchema = new Schema<ISetting>(
  {
    type: { type: String, required: true, unique: true },
    data: { type: Schema.Types.Mixed, required: true },
  },
  { timestamps: { createdAt: false, updatedAt: true } }
) // Solo updatedAt

export default model<ISetting>('Setting', settingSchema)
