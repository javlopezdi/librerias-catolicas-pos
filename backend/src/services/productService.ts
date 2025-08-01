// src/services/productService.ts (actualizado: sin import extra ni cast, usa directamente Product.paginate)
import Product from '../models/Product'

export const getProducts = async (query: any) => {
  const { search, categoryId, page = 1, limit = 10 } = query
  const filters: any = {}
  if (search) {
    filters.$or = [
      { name: { $regex: search, $options: 'i' } },
      { barcode: { $regex: search, $options: 'i' } },
    ]
  }
  if (categoryId) {
    filters.categoryId = categoryId
  }
  const options = {
    page: parseInt(page),
    limit: parseInt(limit),
    sort: { name: 1 },
    populate: 'categoryId supplierId', // Populate referencias
  }
  return await Product.paginate(filters, options)
}

export const getProductById = async (id: string) => {
  return await Product.findById(id).populate('categoryId supplierId')
}

export const createProduct = async (data: any) => {
  const product = new Product(data)
  return await product.save()
}

export const updateProduct = async (id: string, data: any) => {
  return await Product.findByIdAndUpdate(id, data, { new: true })
}

export const deleteProduct = async (id: string) => {
  return await Product.findByIdAndDelete(id)
}
