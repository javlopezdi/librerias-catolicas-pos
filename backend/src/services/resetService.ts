// src/services/resetService.ts (nuevo servicio para reset de métricas)
import Location from '../models/Location'

export const resetMonthlyMetrics = async () => {
  try {
    const result = await Location.updateMany({}, { $set: { monthlySales: 0 } })
    return {
      message: 'Métricas mensuales reseteadas exitosamente',
      modifiedCount: result.modifiedCount,
    }
  } catch (error) {
    throw new Error('Error al resetear métricas mensuales')
  }
}
