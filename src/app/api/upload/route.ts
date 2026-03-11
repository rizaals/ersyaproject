import { NextRequest } from 'next/server'
import { auth } from '@/lib/auth'
import { uploadToCloudinary } from '@/lib/cloudinary'
import { apiSuccess, apiError, validateFile } from '@/lib/utils'

const MAX_SIZE = 5 * 1024 * 1024 // 5MB

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session) return apiError('Tidak diizinkan', 401)

    const formData = await req.formData()
    const file = formData.get('file') as File | null
    const folder = (formData.get('folder') as string) ?? 'assets'

    if (!file) return apiError('File wajib diisi', 400)

    const error = validateFile(file, {
      maxSize: MAX_SIZE,
      allowedTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'],
    })
    if (error) return apiError(error, 400)

    const result = await uploadToCloudinary(file, folder)
    return apiSuccess({ url: result.secure_url, publicId: result.public_id })
  } catch (err) {
    console.error('[upload POST]', err)
    return apiError('Gagal upload file', 500)
  }
}
