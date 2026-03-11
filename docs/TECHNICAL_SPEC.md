# ersya projects — Technical Specification

**Versi:** 1.0.0 | Maret 2026

---

## Daftar Isi

1. [Struktur Folder Project](#1-struktur-folder-project)
2. [API Routes](#2-api-routes)
3. [Konvensi Kode](#4-konvensi-kode)
4. [Midtrans Integration Guide](#5-midtrans-integration-guide)
5. [GrapesJS Integration Guide](#6-grapes-js-integration-guide)
6. [Email Builder — CSS Inliner](#7-email-builder--css-inliner)
7. [Subdomain Publish Flow](#8-subdomain-publish-flow)
8. [Notification System](#9-notification-system)

---

## 1. Struktur Folder Project

```
ersya-projects/
├── prisma/
│   ├── schema.prisma              # Database schema
│   └── seed.ts                    # Seed data (kategori, admin default)
│
├── public/
│   └── assets/                    # Static assets
│
├── src/
│   ├── app/                       # Next.js App Router
│   │
│   │   # ── STOREFRONT (publik) ──────────────────────
│   │   ├── (storefront)/
│   │   │   ├── layout.tsx         # Layout storefront (navbar, footer)
│   │   │   ├── page.tsx           # Beranda /
│   │   │   ├── templates/
│   │   │   │   ├── landing-page/
│   │   │   │   │   ├── page.tsx   # Gallery LP /templates/landing-page
│   │   │   │   │   └── [slug]/
│   │   │   │   │       └── page.tsx  # Detail template LP
│   │   │   │   └── email/
│   │   │   │       ├── page.tsx   # Gallery Email /templates/email
│   │   │   │       └── [slug]/
│   │   │   │           └── page.tsx  # Detail template Email
│   │   │   ├── login/
│   │   │   │   └── page.tsx
│   │   │   └── register/
│   │   │       └── page.tsx
│   │   │
│   │   # ── CLIENT PORTAL (customer) ─────────────────
│   │   ├── (portal)/
│   │   │   ├── layout.tsx         # Layout portal (sidebar, header)
│   │   │   └── portal/
│   │   │       ├── page.tsx       # Dashboard customer /portal
│   │   │       └── order/
│   │   │           ├── new/
│   │   │           │   └── page.tsx   # Form order baru
│   │   │           └── [id]/
│   │   │               ├── page.tsx         # Detail order
│   │   │               ├── payment/
│   │   │               │   ├── page.tsx     # Ringkasan & pembayaran
│   │   │               │   └── status/
│   │   │               │       └── page.tsx # Status pembayaran (return URL)
│   │   │               └── email-preview/
│   │   │                   └── page.tsx     # Preview email template
│   │   │
│   │   # ── ADMIN DASHBOARD ─────────────────────────
│   │   ├── (admin)/
│   │   │   ├── layout.tsx         # Layout admin (sidebar, header)
│   │   │   └── admin/
│   │   │       ├── login/
│   │   │       │   └── page.tsx
│   │   │       ├── page.tsx       # Dashboard admin /admin
│   │   │       ├── orders/
│   │   │       │   ├── page.tsx   # Daftar task/order
│   │   │       │   └── [id]/
│   │   │       │       └── page.tsx  # Detail task
│   │   │       ├── builder/
│   │   │       │   ├── lp/
│   │   │       │   │   └── [projectId]/
│   │   │       │   │       └── page.tsx  # LP Builder
│   │   │       │   ├── email/
│   │   │       │   │   └── [projectId]/
│   │   │       │   │       └── page.tsx  # Email Builder
│   │   │       │   └── import/
│   │   │       │       └── [sessionId]/
│   │   │       │           └── page.tsx  # Review import
│   │   │       ├── templates/
│   │   │       │   ├── landing-page/
│   │   │       │   │   ├── page.tsx      # Manajemen template LP
│   │   │       │   │   └── [id]/
│   │   │       │   │       └── page.tsx  # Edit template LP
│   │   │       │   ├── email/
│   │   │       │   │   ├── page.tsx      # Manajemen template Email
│   │   │       │   │   └── [id]/
│   │   │       │   │       └── page.tsx  # Edit template Email
│   │   │       │   └── import/
│   │   │       │       └── page.tsx      # Import template
│   │   │       ├── themes/
│   │   │       │   └── page.tsx          # Manajemen tema
│   │   │       ├── users/
│   │   │       │   └── page.tsx          # Manajemen admin
│   │   │       └── settings/
│   │   │           └── page.tsx          # Pengaturan sistem
│   │   │
│   │   # ── PREVIEW (publik) ────────────────────────
│   │   ├── preview/
│   │   │   └── [subdomain]/
│   │   │       └── page.tsx       # Serve LP dari subdomain path
│   │   │
│   │   # ── API ROUTES ──────────────────────────────
│   │   └── api/
│   │       ├── auth/
│   │       │   └── [...nextauth]/
│   │       │       └── route.ts
│   │       ├── orders/
│   │       │   ├── route.ts           # GET list, POST create
│   │       │   └── [id]/
│   │       │       ├── route.ts       # GET detail, PATCH update, DELETE
│   │       │       ├── status/
│   │       │       │   └── route.ts   # PATCH update status
│   │       │       └── assets/
│   │       │           └── route.ts   # GET list, POST upload
│   │       ├── payments/
│   │       │   ├── route.ts           # POST create Midtrans transaction
│   │       │   └── webhook/
│   │       │       └── route.ts       # POST Midtrans webhook handler
│   │       ├── projects/
│   │       │   ├── route.ts           # POST create project
│   │       │   └── [id]/
│   │       │       ├── route.ts       # GET, PATCH save GJS data
│   │       │       ├── export/
│   │       │       │   └── route.ts   # POST export HTML/ZIP
│   │       │       ├── publish/
│   │       │       │   └── route.ts   # POST publish ke subdomain
│   │       │       └── inline/
│   │       │           └── route.ts   # POST inline CSS (email only)
│   │       ├── templates/
│   │       │   ├── route.ts           # GET list, POST create
│   │       │   └── [id]/
│   │       │       └── route.ts       # GET, PATCH, DELETE
│   │       ├── categories/
│   │       │   └── route.ts           # GET list, POST create
│   │       ├── messages/
│   │       │   └── [orderId]/
│   │       │       └── route.ts       # GET list, POST send
│   │       ├── notifications/
│   │       │   ├── route.ts           # GET list (for current user)
│   │       │   └── [id]/read/
│   │       │       └── route.ts       # PATCH mark as read
│   │       ├── users/
│   │       │   ├── route.ts           # GET list (admin only), POST create
│   │       │   └── [id]/
│   │       │       └── route.ts       # GET, PATCH, DELETE
│   │       ├── themes/
│   │       │   ├── route.ts           # GET list, POST create
│   │       │   └── [id]/
│   │       │       └── route.ts       # GET, PATCH, DELETE
│   │       ├── upload/
│   │       │   └── route.ts           # POST upload ke Cloudinary
│   │       ├── import/
│   │       │   ├── route.ts           # POST start import session
│   │       │   └── [sessionId]/
│   │       │       └── route.ts       # GET status, POST apply result
│   │       └── test-email/
│   │           └── route.ts           # POST kirim test email (admin only)
│   │
│   ├── components/
│   │   ├── ui/                    # shadcn/ui components (auto-generated)
│   │   ├── storefront/            # Komponen khusus halaman publik
│   │   │   ├── TemplateCard.tsx
│   │   │   ├── TemplateGallery.tsx
│   │   │   ├── CategoryFilter.tsx
│   │   │   └── HeroSection.tsx
│   │   ├── portal/                # Komponen client portal
│   │   │   ├── OrderCard.tsx
│   │   │   ├── OrderTimeline.tsx
│   │   │   ├── ChatBox.tsx
│   │   │   └── PaymentSummary.tsx
│   │   ├── admin/                 # Komponen dashboard admin
│   │   │   ├── TaskTable.tsx
│   │   │   ├── StatsCard.tsx
│   │   │   ├── AssigneeSelect.tsx
│   │   │   └── RevenueWidget.tsx
│   │   ├── builder/               # Komponen builder (GrapesJS wrapper)
│   │   │   ├── LPBuilder.tsx      # Wrapper GrapesJS Webpage
│   │   │   ├── EmailBuilder.tsx   # Wrapper GrapesJS Newsletter
│   │   │   └── BuilderToolbar.tsx
│   │   └── shared/                # Komponen lintas halaman
│   │       ├── NotificationBell.tsx
│   │       ├── FileUploader.tsx
│   │       └── StatusBadge.tsx
│   │
│   ├── lib/
│   │   ├── prisma.ts              # Prisma client singleton
│   │   ├── auth.ts                # NextAuth config
│   │   ├── midtrans.ts            # Midtrans client & helpers
│   │   ├── cloudinary.ts          # Cloudinary upload helper
│   │   ├── resend.ts              # Resend email helper
│   │   ├── fonnte.ts              # Fonnte WhatsApp helper
│   │   ├── juice.ts               # CSS inliner helper
│   │   ├── subdomain.ts           # Subdomain publish helper
│   │   └── order-number.ts        # Generate order number (LF-LP-2026-XXXX)
│   │
│   ├── hooks/
│   │   ├── useNotifications.ts    # Polling notifikasi in-app
│   │   ├── useOrderStatus.ts      # Real-time order status
│   │   └── useBuilder.ts          # GrapesJS state management
│   │
│   └── types/
│       ├── order.ts               # TypeScript types untuk order
│       ├── brief.ts               # TypeScript types untuk LP & Email brief
│       └── gjs.ts                 # TypeScript types untuk GrapesJS data
│
├── .env.example
├── .env.local                     # JANGAN commit ini
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## 2. API Routes

Semua API menggunakan prefix `/api`. Auth menggunakan session cookie dari NextAuth.

### Konvensi Response

```ts
// Success
{ success: true, data: <payload> }

// Error
{ success: false, error: { code: string, message: string } }

// Paginated list
{ success: true, data: { items: [], total: number, page: number, limit: number } }
```

### Error Codes

| Code | HTTP | Keterangan |
|---|---|---|
| `UNAUTHORIZED` | 401 | Tidak login |
| `FORBIDDEN` | 403 | Role tidak punya akses |
| `NOT_FOUND` | 404 | Resource tidak ditemukan |
| `VALIDATION_ERROR` | 422 | Input tidak valid |
| `PAYMENT_REQUIRED` | 402 | Order belum dibayar |
| `INTERNAL_ERROR` | 500 | Server error |

---

### Auth

| Method | Endpoint | Akses | Deskripsi |
|---|---|---|---|
| POST | `/api/auth/register` | Publik | Register customer baru |
| POST | `/api/auth/[...nextauth]` | Publik | NextAuth handler (login, logout, session) |

**POST `/api/auth/register`**
```json
// Request
{ "name": "Budi Santoso", "email": "budi@example.com", "password": "min8chars", "phone": "628123456789" }

// Response
{ "success": true, "data": { "id": "uuid", "name": "Budi Santoso", "email": "budi@example.com" } }
```

---

### Orders

| Method | Endpoint | Akses | Deskripsi |
|---|---|---|---|
| GET | `/api/orders` | Customer (own), Admin+ (all) | List orders dengan filter & pagination |
| POST | `/api/orders` | Customer | Buat order baru |
| GET | `/api/orders/[id]` | Customer (own), Admin+ | Detail order |
| PATCH | `/api/orders/[id]/status` | Admin+ | Update status order |
| PATCH | `/api/orders/[id]/assign` | Superadmin | Assign order ke admin |

**GET `/api/orders`** — Query params:
- `serviceType`: `landing_page | email`
- `status`: filter by status
- `paymentStatus`: `unpaid | paid | ...`
- `assigneeId`: filter by admin
- `page`, `limit`: pagination (default limit: 20)

**POST `/api/orders`**
```json
// Request (Landing Page)
{
  "serviceType": "landing_page",
  "templateId": "uuid-or-null",
  "package": "basic",
  "brief": {
    "business_name": "Toko Kopi Nusantara",
    "description": "Kopi specialty",
    "target_audience": "Pecinta kopi 20-35 tahun",
    "goal": "jualan_produk",
    "color_preference": "Coklat earth tone",
    "font_preference": "Modern serif",
    "page_count": 1
  },
  "notes": "Tolong tambahkan section testimoni"
}

// Request (Email Template)
{
  "serviceType": "email",
  "templateId": "uuid-or-null",
  "package": "basic",
  "brief": {
    "business_name": "Toko Kopi Nusantara",
    "email_type": "promotional",
    "email_goal": "Promo Lebaran diskon 30%",
    "color_preference": "Coklat dan emas",
    "font_preference": "Clean sans-serif",
    "email_platform": "Mailchimp"
  },
  "notes": ""
}

// Response
{
  "success": true,
  "data": {
    "id": "uuid",
    "orderNumber": "LF-LP-2026-0001",
    "status": "awaiting_payment",
    "price": 299000
  }
}
```

---

### Payments

| Method | Endpoint | Akses | Deskripsi |
|---|---|---|---|
| POST | `/api/payments` | Customer | Buat transaksi Midtrans, return Snap token |
| POST | `/api/payments/webhook` | Midtrans server | Webhook notifikasi status pembayaran |
| GET | `/api/payments/[orderId]` | Customer (own), Admin+ | Status pembayaran order |

**POST `/api/payments`**
```json
// Request
{ "orderId": "uuid" }

// Response
{
  "success": true,
  "data": {
    "snapToken": "snap-token-from-midtrans",
    "redirectUrl": "https://app.sandbox.midtrans.com/snap/..."
  }
}
```

**POST `/api/payments/webhook`** — Dipanggil otomatis oleh Midtrans.
- Verifikasi signature key
- Update `payments.status` dan `orders.paymentStatus`
- Jika `status = success` → update `orders.status = pending`, kirim notifikasi WA ke admin

---

### Projects

| Method | Endpoint | Akses | Deskripsi |
|---|---|---|---|
| POST | `/api/projects` | Admin+ | Buat project baru dari order |
| GET | `/api/projects/[id]` | Admin+ | Get project (termasuk GJS data) |
| PATCH | `/api/projects/[id]` | Admin+ | Simpan GJS data (autosave builder) |
| POST | `/api/projects/[id]/export` | Admin+ | Export HTML / ZIP |
| POST | `/api/projects/[id]/publish` | Admin+ | Publish LP ke subdomain |
| POST | `/api/projects/[id]/inline` | Admin+ | Inline CSS email via juice |

**PATCH `/api/projects/[id]`** — Dipanggil setiap autosave di builder.
```json
// Request
{
  "pages": [
    { "name": "Home", "gjsData": { "components": [], "styles": [] } },
    { "name": "About", "gjsData": { "components": [], "styles": [] } }
  ]
}
```

**POST `/api/projects/[id]/export`**
```json
// Request
{ "format": "zip" }  // "zip" untuk multi-page LP, "html" untuk single file

// Response
{ "success": true, "data": { "downloadUrl": "https://cdn.cloudinary.com/..." } }
```

**POST `/api/projects/[id]/publish`**
```json
// Request
{ "subdomain": "kopiNusantara" }  // menjadi kopiNusantara.ersya-projects.id

// Response
{ "success": true, "data": { "url": "https://kopinusantara.ersya-projects.id" } }
```

---

### Templates

| Method | Endpoint | Akses | Deskripsi |
|---|---|---|---|
| GET | `/api/templates` | Publik | List templates (dengan filter) |
| POST | `/api/templates` | Superadmin | Buat template baru |
| GET | `/api/templates/[id]` | Publik | Detail template |
| PATCH | `/api/templates/[id]` | Superadmin | Update metadata / GJS data |
| DELETE | `/api/templates/[id]` | Superadmin | Hapus / archive template |
| POST | `/api/templates/[id]/duplicate` | Superadmin | Duplikasi template |

**GET `/api/templates`** — Query params:
- `serviceType`: `landing_page | email`
- `categoryId`: filter by kategori
- `status`: default `active`
- `emailCategory`: untuk filter template email
- `search`: keyword pencarian
- `page`, `limit`

---

### Messages

| Method | Endpoint | Akses | Deskripsi |
|---|---|---|---|
| GET | `/api/messages/[orderId]` | Customer (own), Admin+ | List pesan dalam order |
| POST | `/api/messages/[orderId]` | Customer (own), Admin+ | Kirim pesan baru |

---

### Notifications

| Method | Endpoint | Akses | Deskripsi |
|---|---|---|---|
| GET | `/api/notifications` | Login | List notifikasi user saat ini |
| PATCH | `/api/notifications/[id]/read` | Login | Tandai notifikasi sebagai dibaca |
| PATCH | `/api/notifications/read-all` | Login | Tandai semua sebagai dibaca |

---

### Upload

| Method | Endpoint | Akses | Deskripsi |
|---|---|---|---|
| POST | `/api/upload` | Login | Upload file ke Cloudinary |

```json
// Request: multipart/form-data
// Field: file (binary), type: "asset" | "thumbnail"

// Response
{ "success": true, "data": { "url": "https://res.cloudinary.com/...", "publicId": "..." } }
```

---

### Import (Template Generator)

| Method | Endpoint | Akses | Deskripsi |
|---|---|---|---|
| POST | `/api/import` | Superadmin | Upload HTML + mulai sesi parsing |
| GET | `/api/import/[sessionId]` | Superadmin | Cek status & hasil parsing |
| POST | `/api/import/[sessionId]/apply` | Superadmin | Simpan hasil import sebagai template / tema |

**POST `/api/import`**
```json
// Request: multipart/form-data
// Fields: file (ZIP atau HTML), serviceType, mode ("style_extract" | "full_import")

// Response
{
  "success": true,
  "data": {
    "sessionId": "uuid",
    "status": "processing"  // "processing" | "done" | "failed"
  }
}
```

---

### Test Email

| Method | Endpoint | Akses | Deskripsi |
|---|---|---|---|
| POST | `/api/test-email` | Admin+ | Kirim HTML email ke alamat tertentu |

```json
// Request
{ "projectId": "uuid", "toEmail": "admin@example.com" }

// Response
{ "success": true, "data": { "messageId": "resend-message-id" } }
```

---

## 3. Konvensi Kode

### Penamaan

```ts
// File: kebab-case
order-status-badge.tsx
use-notifications.ts

// Komponen React: PascalCase
export function OrderStatusBadge() {}

// Fungsi & variabel: camelCase
const orderNumber = generateOrderNumber()

// Konstanta: SCREAMING_SNAKE_CASE
const MAX_UPLOAD_SIZE = 52_428_800

// Prisma model field: camelCase di TypeScript, snake_case di DB (via @map)
```

### API Handler Pattern

```ts
// src/app/api/orders/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json(
      { success: false, error: { code: 'UNAUTHORIZED', message: 'Login required' } },
      { status: 401 }
    )
  }

  try {
    const orders = await prisma.order.findMany({ where: { customerId: session.user.id } })
    return NextResponse.json({ success: true, data: { items: orders, total: orders.length } })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_ERROR', message: 'Something went wrong' } },
      { status: 500 }
    )
  }
}
```

### Role Guard Helper

```ts
// src/lib/auth.ts
export function requireRole(session: Session | null, minRole: Role) {
  const hierarchy = { customer: 0, admin: 1, superadmin: 2 }
  if (!session || hierarchy[session.user.role] < hierarchy[minRole]) {
    throw new Error('FORBIDDEN')
  }
}

// Penggunaan di API handler:
requireRole(session, 'admin')
```

---

## 4. Midtrans Integration Guide

### Setup

```ts
// src/lib/midtrans.ts
import midtransClient from 'midtrans-client'

export const snap = new midtransClient.Snap({
  isProduction: process.env.MIDTRANS_IS_PRODUCTION === 'true',
  serverKey: process.env.MIDTRANS_SERVER_KEY!,
  clientKey: process.env.MIDTRANS_CLIENT_KEY!,
})
```

### Buat Transaksi (Snap Token)

```ts
// src/app/api/payments/route.ts
const parameter = {
  transaction_details: {
    order_id: `LF-${order.orderNumber}-${Date.now()}`, // harus unik di Midtrans
    gross_amount: Number(order.price),
  },
  customer_details: {
    first_name: customer.name,
    email: customer.email,
    phone: customer.phone,
  },
  item_details: [{
    id: order.id,
    price: Number(order.price),
    quantity: 1,
    name: `Jasa ${order.serviceType === 'landing_page' ? 'Landing Page' : 'Email Template'} - Paket ${order.package}`,
  }],
  callbacks: {
    finish: `${process.env.NEXT_PUBLIC_APP_URL}/portal/order/${order.id}/payment/status`,
  },
}

const transaction = await snap.createTransaction(parameter)
// Simpan transaction.token ke tabel payments
```

### Webhook Handler

```ts
// src/app/api/payments/webhook/route.ts
export async function POST(req: NextRequest) {
  const body = await req.json()

  // Verifikasi signature
  const hash = crypto
    .createHash('sha512')
    .update(`${body.order_id}${body.status_code}${body.gross_amount}${process.env.MIDTRANS_SERVER_KEY}`)
    .digest('hex')

  if (hash !== body.signature_key) {
    return NextResponse.json({ message: 'Invalid signature' }, { status: 403 })
  }

  const isSuccess = ['capture', 'settlement'].includes(body.transaction_status)
    && body.fraud_status === 'accept'

  if (isSuccess) {
    // 1. Update payments.status = 'success'
    // 2. Update orders.paymentStatus = 'paid', orders.status = 'pending'
    // 3. Kirim notifikasi WA ke admin
    // 4. Kirim email konfirmasi ke customer
  }

  return NextResponse.json({ message: 'OK' })
}
```

### Frontend — Snap.js

```tsx
// src/components/portal/PaymentSummary.tsx
'use client'
declare global { interface Window { snap: any } }

export function PaymentButton({ snapToken }: { snapToken: string }) {
  const handlePay = () => {
    window.snap.pay(snapToken, {
      onSuccess: (result) => { router.push(`/portal/order/${orderId}/payment/status?result=success`) },
      onPending: (result) => { router.push(`/portal/order/${orderId}/payment/status?result=pending`) },
      onError:   (result) => { router.push(`/portal/order/${orderId}/payment/status?result=error`) },
      onClose:   ()       => { toast.info('Pembayaran dibatalkan') },
    })
  }

  // Load Snap.js di layout atau _document
  // <Script src="https://app.sandbox.midtrans.com/snap/snap.js" data-client-key={...} />

  return <Button onClick={handlePay}>Bayar Sekarang</Button>
}
```

---

## 5. GrapesJS Integration Guide

### LP Builder

```tsx
// src/components/builder/LPBuilder.tsx
'use client'
import { useEffect, useRef } from 'react'
import grapesjs, { Editor } from 'grapesjs'
import 'grapesjs/dist/css/grapes.min.css'
import gjsPresetWebpage from 'grapesjs-preset-webpage'

interface LPBuilderProps {
  projectId: string
  initialPages: Array<{ name: string; gjsData: object }>
  onSave: (pages: Array<{ name: string; gjsData: object }>) => void
}

export function LPBuilder({ projectId, initialPages, onSave }: LPBuilderProps) {
  const editorRef = useRef<Editor | null>(null)

  useEffect(() => {
    const editor = grapesjs.init({
      container: '#gjs-lp',
      plugins: [gjsPresetWebpage],
      pluginsOpts: { [gjsPresetWebpage as any]: {} },
      storageManager: false,   // Kita handle save manual
      deviceManager: {
        devices: [
          { name: 'Desktop', width: '' },
          { name: 'Mobile', width: '375px', widthMedia: '480px' },
        ]
      },
    })

    // Load halaman pertama
    if (initialPages[0]) {
      editor.loadData(initialPages[0].gjsData)
    }

    // Autosave setiap 30 detik
    const interval = setInterval(() => {
      const gjsData = editor.getProjectData()
      // Update state halaman aktif, lalu panggil onSave
    }, 30_000)

    editorRef.current = editor
    return () => { clearInterval(interval); editor.destroy() }
  }, [])

  return <div id="gjs-lp" style={{ height: '100vh' }} />
}
```

### Email Builder

```tsx
// src/components/builder/EmailBuilder.tsx
import gjsPresetNewsletter from 'grapesjs-preset-newsletter'

const editor = grapesjs.init({
  container: '#gjs-email',
  plugins: [gjsPresetNewsletter],
  pluginsOpts: {
    [gjsPresetNewsletter as any]: {
      modalLabelImport: 'Paste HTML Email',
      modalLabelExport: 'Export HTML',
      inlineCss: true,           // Otomatis inline saat preview di canvas
    }
  },
  width: '600px',              // Kunci lebar canvas ke 600px
  storageManager: false,
})
```

---

## 6. Email Builder — CSS Inliner

Saat admin klik "Export & Inline CSS", server memanggil library `juice`:

```ts
// src/lib/juice.ts
import juice from 'juice'

export function inlineEmailCss(html: string): string {
  return juice(html, {
    removeStyleTags: true,      // Hapus <style> tag setelah inline
    preserveMediaQueries: true, // Pertahankan @media untuk mobile
    applyAttributesTableElements: true, // Support atribut tabel email
    webResources: {
      relativeTo: process.env.NEXT_PUBLIC_APP_URL,
    },
  })
}

// src/app/api/projects/[id]/inline/route.ts
const project = await prisma.project.findUnique({ where: { id } })
const rawHtml = project.pages[0].gjsData // atau export dari GrapesJS
const inlinedHtml = inlineEmailCss(rawHtml)

await prisma.project.update({
  where: { id },
  data: { inlinedHtml }
})
```

---

## 7. Subdomain Publish Flow

### Arsitektur

```
Vercel (Next.js App) ──POST /publish──► VPS Subdomain Server
                                          │
                                          ├── Nginx config: *.ersya-projects.id
                                          ├── Static files: /var/www/subdomains/[slug]/
                                          └── Auto-reload Nginx config
```

### VPS Subdomain Server

Server terpisah (Express.js sederhana) di VPS yang menerima request dari app:

```ts
// subdomain-server/index.ts (di VPS)
app.post('/deploy', verifySecret, async (req, res) => {
  const { slug, htmlFiles } = req.body
  // 1. Buat folder /var/www/subdomains/[slug]/
  // 2. Tulis file HTML ke folder tersebut
  // 3. Nginx sudah dikonfigurasi wildcard *.ersya-projects.id → /var/www/subdomains/$1/
  // 4. Tidak perlu reload Nginx karena folder-based routing
  res.json({ success: true, url: `https://${slug}.ersya-projects.id` })
})
```

### Nginx Config (Wildcard)

```nginx
# /etc/nginx/sites-available/ersya-projects-subdomains
server {
  listen 80;
  server_name ~^(?<slug>[^.]+)\.ersya-projects\.id$;

  root /var/www/subdomains/$slug;
  index index.html;

  location / {
    try_files $uri $uri/ /index.html;
  }
}
```

### Helper di App

```ts
// src/lib/subdomain.ts
export async function publishToSubdomain(slug: string, htmlFiles: Record<string, string>) {
  const response = await fetch(`${process.env.SUBDOMAIN_SERVER_URL}/deploy`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Secret': process.env.SUBDOMAIN_SERVER_SECRET!,
    },
    body: JSON.stringify({ slug, htmlFiles }),
  })

  if (!response.ok) throw new Error('Subdomain publish failed')
  return response.json()
}
```

---

## 8. Notification System

### Kirim Notifikasi (Server-Side)

```ts
// src/lib/notify.ts
import { prisma } from './prisma'
import { sendWhatsApp } from './fonnte'
import { sendEmail } from './resend'

interface NotifyOptions {
  userId: string
  orderId?: string
  type: NotificationType
  message: string
  whatsapp?: { phone: string; text: string }
  email?: { to: string; subject: string; html: string }
}

export async function notify(opts: NotifyOptions) {
  // 1. Simpan ke DB (in-app)
  await prisma.notification.create({
    data: {
      userId: opts.userId,
      orderId: opts.orderId,
      type: opts.type,
      message: opts.message,
    }
  })

  // 2. WhatsApp (jika diminta)
  if (opts.whatsapp) {
    await sendWhatsApp(opts.whatsapp.phone, opts.whatsapp.text)
  }

  // 3. Email (jika diminta)
  if (opts.email) {
    await sendEmail(opts.email)
  }
}
```

### Polling In-App (Client-Side)

```ts
// src/hooks/useNotifications.ts
export function useNotifications() {
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    const poll = async () => {
      const res = await fetch('/api/notifications?isRead=false&limit=1')
      const data = await res.json()
      setUnreadCount(data.data.total)
    }

    poll()
    const interval = setInterval(poll, 30_000) // polling setiap 30 detik
    return () => clearInterval(interval)
  }, [])

  return { unreadCount }
}
```

> Untuk versi lebih advanced, ganti polling dengan **Server-Sent Events (SSE)** atau **WebSocket** menggunakan library seperti `pusher-js` atau Next.js native streaming.

---

*Dokumen ini adalah referensi teknis untuk developer. Update seiring perkembangan implementasi.*
