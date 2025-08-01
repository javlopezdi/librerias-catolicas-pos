// src/services/categoryService.ts
import Category from '../models/Category'

export const getCategories = async () => {
  return await Category.find().sort({ name: 1 })
}

export const getCategoryById = async (id: string) => {
  return await Category.findById(id)
}

export const createCategory = async (data: any) => {
  const category = new Category(data)
  return await category.save()
}

export const updateCategory = async (id: string, data: any) => {
  return await Category.findByIdAndUpdate(id, data, { new: true })
}

export const deleteCategory = async (id: string) => {
  return await Category.findByIdAndDelete(id)
}
