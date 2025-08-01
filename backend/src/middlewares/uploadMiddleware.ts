// src/middlewares/uploadMiddleware.ts (actualizado para resolver el error de tipos)
import multer from 'multer'
import path from 'path'

// Configuración de almacenamiento en memoria
const storage = multer.memoryStorage()

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Límite de 5MB por archivo
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['text/csv', 'application/pdf']
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true)
    } else {
      // Cast a 'any' para resolver el conflicto de tipos en TypeScript (el tipo esperado para error es any, pero strict mode puede causar issues)
      cb(
        new Error('Tipo de archivo no soportado. Solo CSV o PDF.') as any,
        false
      )
    }
  },
})

export const uploadSingle = upload.single('file') // Para un solo archivo, campo 'file'
