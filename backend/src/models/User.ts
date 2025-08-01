// src/models/User.ts (actualizado con hooks de auditoría, para creaciones y actualizaciones de usuarios)
import { Schema, model, Document } from 'mongoose'
import AuditLog from './AuditLog'

export interface IUser extends Document {
  name: string
  email: string
  password: string
  role: 'Admin' | 'Vendedor' | 'Almacén' | 'Compras'
  totalSales: number
  lastSale?: Date
  createdAt: Date
  updatedAt: Date
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ['Admin', 'Vendedor', 'Almacén', 'Compras'],
      required: true,
    },
    totalSales: { type: Number, default: 0 },
    lastSale: { type: Date },
  },
  { timestamps: true }
)

// Hook para creación
userSchema.post('save', async function (doc: IUser) {
  if (this.isNew) {
    try {
      const auditLog = new AuditLog({
        userId: doc._id, // Usuario que crea podría ser admin; para simplicidad usar el propio ID
        action: 'User created',
        details: JSON.stringify({ userId: doc._id, role: doc.role }),
        ip: 'unknown',
        date: new Date(),
      })
      await auditLog.save()
    } catch (err) {
      console.error('Error in User audit hook:', err)
    }
  }
})

// Hook para actualización
userSchema.post('findOneAndUpdate', async function (doc: IUser | null) {
  if (doc) {
    try {
      const auditLog = new AuditLog({
        userId: doc._id,
        action: 'User updated',
        details: JSON.stringify({
          userId: doc._id,
          updatedFields: this.getUpdate(),
        }),
        ip: 'unknown',
        date: new Date(),
      })
      await auditLog.save()
    } catch (err) {
      console.error('Error in User update audit hook:', err)
    }
  }
})

// Hook para eliminación
userSchema.post(
  'deleteOne',
  { document: true, query: false },
  async function (doc: IUser) {
    try {
      const auditLog = new AuditLog({
        userId: doc._id,
        action: 'User deleted',
        details: JSON.stringify({ userId: doc._id }),
        ip: 'unknown',
        date: new Date(),
      })
      await auditLog.save()
    } catch (err) {
      console.error('Error in User delete audit hook:', err)
    }
  }
)

export default model<IUser>('User', userSchema)
