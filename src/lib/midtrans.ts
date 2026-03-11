import midtransClient from 'midtrans-client'

// Snap client — untuk Payment Page (redirect / popup)
export const snap = new midtransClient.Snap({
  isProduction: process.env.MIDTRANS_IS_PRODUCTION === 'true',
  serverKey: process.env.MIDTRANS_SERVER_KEY!,
  clientKey: process.env.MIDTRANS_CLIENT_KEY!,
})

// Core API client — untuk cek status, refund, dll.
export const coreApi = new midtransClient.CoreApi({
  isProduction: process.env.MIDTRANS_IS_PRODUCTION === 'true',
  serverKey: process.env.MIDTRANS_SERVER_KEY!,
  clientKey: process.env.MIDTRANS_CLIENT_KEY!,
})

// Verifikasi signature dari webhook Midtrans
import crypto from 'crypto'

export function verifyMidtransSignature(
  orderId: string,
  statusCode: string,
  grossAmount: string,
  signatureKey: string
): boolean {
  const hash = crypto
    .createHash('sha512')
    .update(`${orderId}${statusCode}${grossAmount}${process.env.MIDTRANS_SERVER_KEY}`)
    .digest('hex')
  return hash === signatureKey
}

// Cek apakah status transaksi Midtrans dianggap berhasil
export function isMidtransSuccess(transactionStatus: string, fraudStatus: string): boolean {
  return (
    (transactionStatus === 'capture' && fraudStatus === 'accept') ||
    transactionStatus === 'settlement'
  )
}
