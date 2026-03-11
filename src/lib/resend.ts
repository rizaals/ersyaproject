import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

interface SendEmailOptions {
  to: string | string[]
  subject: string
  html: string
  from?: string
}

export async function sendEmail({ to, subject, html, from }: SendEmailOptions) {
  const { data, error } = await resend.emails.send({
    from: from ?? process.env.RESEND_FROM_EMAIL!,
    to: Array.isArray(to) ? to : [to],
    subject,
    html,
  })

  if (error) throw new Error(`Resend error: ${error.message}`)
  return data
}

// ── Email templates ────────────────────────────────────────────

export function emailOrderConfirmed(orderNumber: string, serviceType: string) {
  return `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Pembayaran Berhasil! 🎉</h2>
      <p>Terima kasih telah memesan layanan <strong>${serviceType === 'landing_page' ? 'Landing Page' : 'Email Template'}</strong> di ersya projects.</p>
      <p>Nomor order Anda: <strong>${orderNumber}</strong></p>
      <p>Tim kami akan segera memproses pesanan Anda. Anda akan mendapat notifikasi ketika pengerjaan dimulai.</p>
      <p>Pantau progress di <a href="${process.env.NEXT_PUBLIC_APP_URL}/portal">Client Portal</a>.</p>
    </div>
  `
}

export function emailOrderReady(orderNumber: string, portalUrl: string) {
  return `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Pesanan Anda Siap untuk Direview! ✅</h2>
      <p>Order <strong>${orderNumber}</strong> telah selesai dikerjakan oleh tim kami.</p>
      <p>Silakan buka link berikut untuk melihat hasilnya:</p>
      <p><a href="${portalUrl}" style="background: #2563eb; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none;">Lihat Hasil</a></p>
      <p>Jika ada yang perlu direvisi, Anda bisa request revisi langsung dari portal.</p>
    </div>
  `
}

export function emailPaymentFailed(orderNumber: string, retryUrl: string) {
  return `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Pembayaran Gagal</h2>
      <p>Pembayaran untuk order <strong>${orderNumber}</strong> tidak berhasil diproses.</p>
      <p>Silakan coba bayar ulang melalui link berikut:</p>
      <p><a href="${retryUrl}">Bayar Ulang</a></p>
    </div>
  `
}
