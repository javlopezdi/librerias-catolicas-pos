// src/services/supplierService.ts
import Supplier from '../models/Supplier'

export const getSuppliers = async () => {
  return await Supplier.find().sort({ name: 1 })
}

export const getSupplierById = async (id: string) => {
  return await Supplier.findById(id)
}

export const createSupplier = async (data: any) => {
  const supplier = new Supplier(data)
  return await supplier.save()
}

export const updateSupplier = async (id: string, data: any) => {
  return await Supplier.findByIdAndUpdate(id, data, { new: true })
}

export const deleteSupplier = async (id: string) => {
  return await Supplier.findByIdAndDelete(id)
}
