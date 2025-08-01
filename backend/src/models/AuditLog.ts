// src/models/AuditLog.ts (actualizado para paginación)
import { Schema, model, Document, PaginateModel } from 'mongoose'
import mongoosePaginate from 'mongoose-paginate-v2'

interface IAuditLog extends Document {
  userId: Schema.Types.ObjectId
  action: string
  details: string // O JSON como string
  ip: string
  date: Date
}

const auditLogSchema = new Schema<IAuditLog>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  action: { type: String, required: true },
  details: { type: String, required: true },
  ip: { type: String, required: true },
  date: { type: Date, default: Date.now },
})

auditLogSchema.plugin(mongoosePaginate)

export default model<IAuditLog, PaginateModel<IAuditLog>>(
  'AuditLog',
  auditLogSchema
)
