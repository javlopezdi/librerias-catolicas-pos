// src/services/customerService.ts
import Customer from '../models/Customer'

export const getCustomers = async () => {
  return await Customer.find().sort({ name: 1 })
}

export const getCustomerById = async (id: string) => {
  return await Customer.findById(id)
}

export const createCustomer = async (data: any) => {
  const customer = new Customer(data)
  return await customer.save()
}

export const updateCustomer = async (id: string, data: any) => {
  return await Customer.findByIdAndUpdate(id, data, { new: true })
}

export const deleteCustomer = async (id: string) => {
  return await Customer.findByIdAndDelete(id)
}
