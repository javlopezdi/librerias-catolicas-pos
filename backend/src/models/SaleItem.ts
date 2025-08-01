import { Schema, model, Document } from 'mongoose'

interface ISaleItem extends Document {
  saleId: Schema.Types.ObjectId
  productId: Schema.Types.ObjectId
  quantity: number
  priceAtSale: number
  subtotal: number
}

const saleItemSchema = new Schema<ISaleItem>({
  saleId: { type: Schema.Types.ObjectId, ref: 'Sale', required: true },
  productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true },
  priceAtSale: { type: Number, required: true },
  subtotal: { type: Number, required: true },
})

export default model<ISaleItem>('SaleItem', saleItemSchema)
