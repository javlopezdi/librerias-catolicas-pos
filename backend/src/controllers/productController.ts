// src/controllers/productController.ts
import { Request, Response } from 'express'
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../services/productService'

export const getProductsController = async (req: Request, res: Response) => {
  try {
    const products = await getProducts(req.query)
    res.json({ success: true, data: products })
  } catch (error: any) {
    throw error
  }
}

export const getProductByIdController = async (req: Request, res: Response) => {
  try {
    const product = await getProductById(req.params.id)
    if (!product)
      return res.status(404).json({ error: 'Producto no encontrado' })
    res.json({ success: true, data: product })
  } catch (error: any) {
    throw error
  }
}

export const createProductController = async (req: Request, res: Response) => {
  try {
    const product = await createProduct(req.body)
    res.status(201).json({ success: true, data: product })
  } catch (error: any) {
    throw error
  }
}

export const updateProductController = async (req: Request, res: Response) => {
  try {
    const product = await updateProduct(req.params.id, req.body)
    if (!product)
      return res.status(404).json({ error: 'Producto no encontrado' })
    res.json({ success: true, data: product })
  } catch (error: any) {
    throw error
  }
}

export const deleteProductController = async (req: Request, res: Response) => {
  try {
    const product = await deleteProduct(req.params.id)
    if (!product)
      return res.status(404).json({ error: 'Producto no encontrado' })
    res.json({ success: true, message: 'Producto eliminado' })
  } catch (error: any) {
    throw error
  }
}
