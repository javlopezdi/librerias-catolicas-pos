// src/server.ts (actualizado)
import express, { Express, Request, Response } from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import * as dotenv from 'dotenv'

// Importar modelos
import './models/User'
import './models/Product'
import './models/Category'
import './models/Stock'
import './models/Location'
import './models/Supplier'
import './models/Customer'
import './models/Sale'
import './models/SaleItem'
import './models/Purchase'
import './models/Transfer'
import './models/AuditLog'
import './models/Setting'

// Importar rutas
import authRoutes from './routes/authRoutes'
import userRoutes from './routes/userRoutes'
import productRoutes from './routes/productRoutes'
import categoryRoutes from './routes/categoryRoutes'
import stockRoutes from './routes/stockRoutes'
import saleRoutes from './routes/saleRoutes'
import locationRoutes from './routes/locationRoutes'
import supplierRoutes from './routes/supplierRoutes'
import customerRoutes from './routes/customerRoutes'
import auditRoutes from './routes/auditRoutes'
import reportRoutes from './routes/reportRoutes'
import settingRoutes from './routes/settingRoutes'
import purchaseRoutes from './routes/purchaseRoutes'
import transferRoutes from './routes/transferRoutes'
import importRoutes from './routes/importRoutes'
import exportRoutes from './routes/exportRoutes'

// Middlewares
import { errorHandler } from './middlewares/errorHandler'
import { auditMiddleware } from './middlewares/auditMiddleware'

dotenv.config()

const app: Express = express()
app.use(cors())
app.use(express.json())

// Middleware de auditoría global (antes de las rutas para capturar todas)
app.use(auditMiddleware)

// Rutas
app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)
app.use('/api/products', productRoutes)
app.use('/api/categories', categoryRoutes)
app.use('/api/stocks', stockRoutes)
app.use('/api/sales', saleRoutes)
app.use('/api/locations', locationRoutes)
app.use('/api/suppliers', supplierRoutes)
app.use('/api/customers', customerRoutes)
app.use('/api/audits', auditRoutes)
app.use('/api/reports', reportRoutes)
app.use('/api/settings', settingRoutes)
app.use('/api/purchases', purchaseRoutes)
app.use('/api/transfers', transferRoutes)
app.use('/api/imports', importRoutes)
app.use('/api/exports', exportRoutes)

app.get('/', (req: Request, res: Response) => {
  res.send('Backend MEAN con TypeScript y Docker funcionando!')
})

// Middleware de errores global
app.use(errorHandler)

// Conexión a MongoDB
mongoose
  .connect(process.env.MONGO_URI || 'mongodb://mongo:27017/libreriasdb')
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err))

const PORT: number = parseInt(process.env.PORT || '3000')
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
