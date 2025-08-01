// src/controllers/categoryController.ts
import { Request, Response } from 'express'
import {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../services/categoryService'

export const getCategoriesController = async (req: Request, res: Response) => {
  try {
    const categories = await getCategories()
    res.json({ success: true, data: categories })
  } catch (error: any) {
    throw error
  }
}

export const getCategoryByIdController = async (
  req: Request,
  res: Response
) => {
  try {
    const category = await getCategoryById(req.params.id)
    if (!category)
      return res.status(404).json({ error: 'Categoría no encontrada' })
    res.json({ success: true, data: category })
  } catch (error: any) {
    throw error
  }
}

export const createCategoryController = async (req: Request, res: Response) => {
  try {
    const category = await createCategory(req.body)
    res.status(201).json({ success: true, data: category })
  } catch (error: any) {
    throw error
  }
}

export const updateCategoryController = async (req: Request, res: Response) => {
  try {
    const category = await updateCategory(req.params.id, req.body)
    if (!category)
      return res.status(404).json({ error: 'Categoría no encontrada' })
    res.json({ success: true, data: category })
  } catch (error: any) {
    throw error
  }
}

export const deleteCategoryController = async (req: Request, res: Response) => {
  try {
    const category = await deleteCategory(req.params.id)
    if (!category)
      return res.status(404).json({ error: 'Categoría no encontrada' })
    res.json({ success: true, message: 'Categoría eliminada' })
  } catch (error: any) {
    throw error
  }
}
