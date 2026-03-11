import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { NextResponse } from 'next/server'

// shadcn/ui utility
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// BigInt-safe JSON serializer
function safeJson(value: unknown): string {
  return JSON.stringify(value, (_, v) => (typeof v === 'bigint' ? v.toString() : v))
}

// API response helpers
// apiSuccess(data) | apiSuccess(data, 'message', 201)
export function apiSuccess<T>(data: T, message?: string, status = 200) {
  const body = safeJson({ success: true, data, ...(message ? { message } : {}) })
  return new NextResponse(body, { status, headers: { 'Content-Type': 'application/json' } })
}

// apiError('message') | apiError('message', 400)
export function apiError(message: string, status = 400) {
  return NextResponse.json({ success: false, message }, { status })
}

// Format harga ke Rupiah
export function formatRupiah(amount: number | bigint): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(Number(amount))
}

// Validate file upload
interface ValidateFileOptions {
  maxSize?: number
  allowedTypes?: string[]
}

export function validateFile(file: File, opts?: ValidateFileOptions): string | null {
  const maxSize = opts?.maxSize ?? Number(process.env.MAX_UPLOAD_SIZE ?? 52_428_800)
  const allowedTypes = opts?.allowedTypes
    ?? (process.env.ALLOWED_FILE_TYPES ?? 'image/jpeg,image/png,image/webp,application/pdf').split(',')

  if (!allowedTypes.includes(file.type)) {
    return `Tipe file tidak diizinkan: ${file.type}`
  }
  if (file.size > maxSize) {
    return `Ukuran file melebihi batas (maks ${(maxSize / 1_048_576).toFixed(0)}MB)`
  }
  return null
}
