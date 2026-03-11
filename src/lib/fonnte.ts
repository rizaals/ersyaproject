// Fonnte WhatsApp API
// Docs: https://fonnte.com/docs

export async function sendWhatsApp(phone: string, message: string) {
  const response = await fetch('https://api.fonnte.com/send', {
    method: 'POST',
    headers: {
      Authorization: process.env.FONNTE_TOKEN!,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      target: phone,
      message,
      countryCode: '62', // Indonesia
    }),
  })

  if (!response.ok) {
    const error = await response.text()
    console.error('Fonnte error:', error)
    // Tidak throw — notifikasi WA bukan blocking operation
  }

  return response.json()
}

// ── WA message templates ───────────────────────────────────────

export function waOrderNew(orderNumber: string, serviceType: string, customerName: string) {
  const service = serviceType === 'landing_page' ? 'Landing Page' : 'Email Template'
  return `🔔 *Order Baru — ersya projects*\n\nNo. Order: *${orderNumber}*\nLayanan: ${service}\nCustomer: ${customerName}\n\nBuka dashboard untuk assign task:\n${process.env.NEXT_PUBLIC_APP_URL}/admin/orders`
}

export function waOrderRevision(orderNumber: string, note: string) {
  return `🔁 *Request Revisi — ersya projects*\n\nNo. Order: *${orderNumber}*\nCatatan: ${note}\n\nBuka task:\n${process.env.NEXT_PUBLIC_APP_URL}/admin/orders`
}

export function waOrderReady(orderNumber: string, customerPhone: string) {
  return `✅ *Pesanan Siap Direview — ersya projects*\n\nHalo! Order Anda *${orderNumber}* sudah selesai dikerjakan.\n\nCek hasilnya di:\n${process.env.NEXT_PUBLIC_APP_URL}/portal`
}
