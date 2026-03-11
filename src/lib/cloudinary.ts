import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export { cloudinary }

export async function uploadFile(
  buffer: Buffer,
  options: { folder?: string; publicId?: string; resourceType?: 'image' | 'raw' | 'auto' } = {}
) {
  const { folder = 'ersya-projects/assets', publicId, resourceType = 'auto' } = options

  return new Promise<{ url: string; publicId: string }>((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder, public_id: publicId, resource_type: resourceType },
      (error, result) => {
        if (error || !result) return reject(error)
        resolve({ url: result.secure_url, publicId: result.public_id })
      }
    )
    uploadStream.end(buffer)
  })
}

export async function deleteFile(publicId: string) {
  return cloudinary.uploader.destroy(publicId)
}

// Upload from a File object (for API routes receiving FormData)
export async function uploadToCloudinary(
  file: File,
  folder = 'ersya-projects/assets'
): Promise<{ secure_url: string; public_id: string }> {
  const arrayBuffer = await file.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: `ersya-projects/${folder}`, resource_type: 'auto' },
      (error, result) => {
        if (error || !result) return reject(error)
        resolve({ secure_url: result.secure_url, public_id: result.public_id })
      }
    )
    uploadStream.end(buffer)
  })
}
