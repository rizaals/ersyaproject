# ersya projects — Product Requirements Document (PRD)

**Versi:** 1.3.1
**Tanggal:** Maret 2026
**Status:** Draft
**Dibuat oleh:** Tim Product

### Changelog

| Versi | Tanggal | Perubahan |
|---|---|---|
| 1.0.0 | Maret 2026 | Dokumen awal |
| 1.1.0 | Maret 2026 | Tambah Section 11: Template Generator (HTML Importer) |
| 1.2.0 | Maret 2026 | Pemisahan penuh dua layanan: Landing Page Builder & Email Builder di semua section |
| 1.3.0 | Maret 2026 | Tambah payment gateway Midtrans + flow penambahan template |
| 1.3.1 | Maret 2026 | Rename brand: ersya projects (formerly LandingForge) |

---

## Daftar Isi

1. [Overview Produk](#1-overview-produk)
2. [User Roles & Persona](#2-user-roles--persona)
3. [Spesifikasi Fitur](#3-spesifikasi-fitur)
   - 3.1 Storefront (Halaman Publik)
   - 3.2 Client Portal (Area Customer)
   - 3.3 Admin Dashboard (Area Tim Internal)
   - 3.4 Sistem Notifikasi
4. [Sitemap](#4-sitemap)
5. [Database Schema](#5-database-schema)
6. [Tech Stack](#6-tech-stack)
7. [Alur Kerja Sistem](#7-alur-kerja-sistem)
   - 7.1 Flow Order Landing Page
   - 7.2 Flow Order Email Template
   - 7.3 Flow Penambahan Template ke Library
8. [Paket Layanan](#8-paket-layanan)
9. [Estimasi Development](#9-estimasi-development)
10. [Non-Functional Requirements](#10-non-functional-requirements)
11. [Template Generator — HTML Importer](#11-template-generator--html-importer)

---

## 1. Overview Produk

### 1.1 Latar Belakang

Banyak pelaku usaha kecil dan UMKM di Indonesia yang ingin memiliki presence online yang profesional, namun terkendala keterbatasan kemampuan coding dan desain. ersya projects hadir sebagai platform jasa berbasis web yang menyediakan **dua layanan utama**: pembuatan **landing page** dan pembuatan **email template** — tim admin yang mengerjakan semua hal teknis, mulai dari pemilihan template, kustomisasi konten, hingga pengiriman atau pengunggahan hasil ke hosting.

### 1.2 Dua Layanan Utama

| | **Layanan 1: Landing Page** | **Layanan 2: Email Template** |
|---|---|---|
| Deskripsi | Halaman web statis untuk jualan, iklan, atau promosi | Template HTML untuk campaign email marketing |
| Output | File HTML/CSS/JS atau subdomain aktif | File HTML inline CSS siap kirim |
| Target pasar | Penjual produk, pemilik jasa, pelaku iklan digital | Pemilik bisnis yang butuh email promosi, newsletter, welcome email |
| Builder | GrapesJS Webpage Preset | GrapesJS Newsletter Preset |
| Layout engine | Div + Flexbox / Grid bebas | Table-based wajib (email-safe) |
| CSS | Eksternal + internal | Inline only (diproses via `juice`) |
| JavaScript | Diperbolehkan | Tidak ada |
| Lebar canvas | Bebas (full viewport) | Maks 600px |
| Multi-halaman | Ya (maks 5 halaman per project) | Tidak (selalu single file) |
| Test & delivery | Preview browser / subdomain | Test kirim ke inbox nyata |

### 1.3 Tujuan Produk

- Menyediakan storefront dengan ratusan template untuk kedua layanan agar calon pelanggan bisa memilih dengan mudah.
- Memberikan pengalaman order yang mudah dan transparan melalui client portal.
- Mempercepat proses pengerjaan tim admin melalui dashboard terpusat dengan builder yang sesuai per layanan.
- Menghasilkan output yang langsung siap pakai tanpa perlu kemampuan teknis dari customer.

### 1.4 Identitas Produk

| Atribut | Keterangan |
|---|---|
| Nama Produk | ersya projects |
| Tagline | "Tampil profesional online — tanpa coding, langsung aktif." |
| Target Pasar | UMKM, pelaku jualan online, pemilik bisnis kecil Indonesia |
| Model Bisnis | Jasa pembuatan one-time; biaya tambahan untuk desain aset & tema custom |
| Payment | Midtrans — VA, QRIS, e-wallet (GoPay, OVO, ShopeePay), kartu kredit |
| Output LP | File HTML siap upload atau subdomain aktif |
| Output Email | File HTML inline CSS siap dipakai di platform email manapun |

---

## 2. User Roles & Persona

### 2.1 Daftar Role

| Role | Akses | Deskripsi |
|---|---|---|
| **Superadmin** | Full access | Pemilik sistem. Bisa manage semua admin, template, order, dan konfigurasi. |
| **Admin** | Dashboard + Builder | Anggota tim pengerjaan. Bisa lihat & kerjakan task yang ditugaskan. |
| **Customer** | Storefront + Client Portal | Pengguna yang melakukan order. Bisa pantau progress dan komunikasi dengan tim. |

### 2.2 Customer Persona

**Pengguna Layanan Landing Page:**
- Penjual produk fisik (fashion, makanan, craft) yang butuh landing page untuk iklan Meta/Google Ads.
- Pemilik kursus / coaching yang butuh halaman pendaftaran peserta.
- Pelaku bisnis jasa lokal (salon, bengkel, klinik) yang ingin meningkatkan kepercayaan calon pelanggan.
- Reseller / dropshipper yang butuh landing page produk dengan cepat.

**Pengguna Layanan Email Template:**
- Pemilik toko online yang butuh email promosi / promo hari raya.
- Pelaku bisnis yang ingin mengirim newsletter berkala ke pelanggannya.
- Startup / bisnis yang butuh welcome email atau email konfirmasi yang profesional.
- Pengguna platform email marketing (Mailchimp, Klaviyo, Sendinblue) yang butuh template custom.

---

## 3. Spesifikasi Fitur

### 3.1 Storefront (Halaman Publik)

Halaman publik yang dapat diakses siapapun tanpa login. Berfungsi sebagai etalase template dan pintu masuk order untuk kedua layanan.

#### 3.1.1 Halaman Beranda

- Hero section: tagline utama, dua CTA utama: "Buat Landing Page" dan "Buat Email Template".
- Tab / toggle layanan untuk switch antara preview Landing Page dan Email Template.
- Section cara kerja: 3 langkah (Pilih Template → Kirim Brief → Terima Hasil).
- Daftar paket harga untuk masing-masing layanan.
- Testimonial pelanggan.
- FAQ umum.

#### 3.1.2 Halaman Template Gallery — Landing Page

URL: `/templates/landing-page`

- Grid/masonry layout menampilkan template landing page.
- Filter:
  - Kategori industri: Fashion, F&B, Jasa, Kursus, Properti, Kesehatan, Teknologi, dll.
  - Jumlah halaman: 1 halaman / 2–3 halaman / 4–5 halaman
  - Style: Minimalis, Bold, Elegant, Playful, Corporate
- Search bar berdasarkan nama atau kata kunci.
- Setiap card menampilkan: thumbnail, nama, kategori, jumlah halaman, badge "Populer".
- Klik card → halaman detail template.

#### 3.1.3 Halaman Template Gallery — Email Template

URL: `/templates/email`

- Grid layout menampilkan template email.
- Filter:
  - Kategori jenis email: Promotional, Newsletter, Welcome, Transactional, Abandoned Cart, Event / Undangan
  - Industri: Fashion, F&B, Teknologi, Jasa, dll.
  - Layout: Single column, Multi-column, Full-width banner
- Search bar berdasarkan nama atau kata kunci.
- Setiap card menampilkan: thumbnail (preview email pada lebar 600px), nama, kategori.
- Klik card → halaman detail template.

#### 3.1.4 Halaman Detail Template

Berlaku untuk kedua jenis template, dengan konten disesuaikan:

- **Landing Page**: preview full-page scrollable, info jumlah halaman, demo interaktif opsional.
- **Email Template**: preview pada simulasi lebar 600px, preview mobile (320px), info kompatibilitas email client (Gmail, Outlook, Apple Mail).
- Info umum: nama, kategori, deskripsi singkat.
- Tombol "Order Template Ini" → form order (login dulu jika belum).
- Rekomendasi template serupa di bawah.

#### 3.1.5 Halaman Login & Register

- Form register customer: nama, email, password, no. WhatsApp.
- Form login: email + password.
- Forgot password via email.

---

### 3.2 Client Portal (Area Customer)

Diakses setelah login. Tempat customer melakukan order untuk salah satu atau kedua layanan, memantau progress, dan berkomunikasi dengan tim.

#### 3.2.1 Dashboard Customer

- Ringkasan: order aktif, order selesai, notifikasi terbaru.
- Daftar semua order dengan kolom: No. Order, Jenis Layanan (LP / Email), Template, Status, Status Pembayaran, Tanggal.
- Filter order berdasarkan jenis layanan dan status pembayaran.

#### 3.2.2 Form Order Baru — Landing Page

- Pilih template landing page (dari gallery atau ketik nama manual).
- Isi brief:
  - Nama bisnis
  - Deskripsi produk / layanan
  - Target audiens
  - Warna preferensi
  - Font preferensi
  - Tujuan halaman (jualan produk / daftar leads / portofolio / dll.)
- Jumlah halaman yang diinginkan (1 / 2–3 / 4–5).
- Upload referensi: logo, gambar produk, foto tim (JPG, PNG, PDF, ZIP — maks 50MB).
- Pilih paket: Dasar / Custom / Premium.
- Catatan tambahan.
- Submit → halaman ringkasan order + total harga.
- Customer klik **"Bayar Sekarang"** → redirect ke halaman pembayaran Midtrans (Snap).
- Setelah pembayaran berhasil → status order: **Menunggu Konfirmasi**.
- Jika pembayaran gagal / kedaluwarsa → status order: **Menunggu Pembayaran** (customer bisa bayar ulang).

#### 3.2.3 Form Order Baru — Email Template

- Pilih template email (dari gallery atau ketik nama manual).
- Isi brief:
  - Nama bisnis / brand
  - Jenis email: Promotional / Newsletter / Welcome / Transactional / Event
  - Isi & tujuan email (misal: "Promo Lebaran diskon 30% untuk produk X")
  - Warna brand
  - Font preferensi
  - Platform email yang akan dipakai (Mailchimp / Klaviyo / manual send / dll.)
- Upload referensi: logo, gambar produk, banner (JPG, PNG, ZIP — maks 50MB).
- Pilih paket: Dasar / Custom / Premium.
- Catatan tambahan.
- Submit → halaman ringkasan order + total harga.
- Customer klik **"Bayar Sekarang"** → redirect ke halaman pembayaran Midtrans (Snap).
- Setelah pembayaran berhasil → status order: **Menunggu Konfirmasi**.
- Jika pembayaran gagal / kedaluwarsa → status order: **Menunggu Pembayaran** (customer bisa bayar ulang).

#### 3.2.4 Halaman Detail Order

Berlaku untuk kedua layanan, dengan perbedaan pada bagian preview hasil:

- Status timeline: `Menunggu Pembayaran → Menunggu Konfirmasi → Dikerjakan → Review → Selesai`
- **Landing Page**: preview via link subdomain atau unduh ZIP file HTML.
- **Email Template**: preview via link halaman preview, tombol "Kirim Test ke Email Saya" (admin yang eksekusi), unduh file HTML.
- Tombol "Request Revisi" dengan form keterangan (jika masih dalam batas revisi paket).
- Riwayat chat/komentar antara customer dan admin.

---

### 3.3 Admin Dashboard (Area Tim Internal)

Diakses oleh admin dan superadmin. Tempat mengelola semua task pengerjaan untuk kedua layanan.

#### 3.3.1 Halaman Login Admin

- URL terpisah dari storefront: `/admin/login`
- Hanya bisa diakses akun dengan role admin atau superadmin.

#### 3.3.2 Dashboard Utama Admin

- Statistik terpisah per layanan: LP hari ini, Email hari ini, total pending, selesai bulan ini.
- Statistik pendapatan: total revenue bulan ini, jumlah transaksi berhasil, jumlah pending pembayaran.
- Task list terbaru yang sudah dibayar dan belum ditugaskan, dengan badge jenis layanan (LP / Email).
- Notifikasi badge untuk order baru (paid), pesan customer baru, dan pembayaran masuk.

#### 3.3.3 Manajemen Task / Order

- Tabel semua order: ID Order, Jenis Layanan, Nama Customer, Template, Status, Assignee, Tanggal, Deadline.
- Filter berdasarkan: jenis layanan, status, assignee.
- Superadmin bisa assign task ke admin tertentu.
- Klik baris → buka detail task.

#### 3.3.4 Detail Task

- Info jenis layanan yang jelas di bagian atas (badge "Landing Page" atau "Email Template").
- Info brief dari customer: semua field yang diisi saat order.
- Daftar aset yang diupload customer (bisa didownload).
- Tombol "Buka LP Builder" atau "Buka Email Builder" sesuai jenis layanan.
- Form update status order.
- Kolom chat/komentar dengan customer.
- Input link preview atau upload file hasil.

#### 3.3.5 Landing Page Builder

GrapesJS dengan preset `grapesjs-preset-webpage`, di-embed di halaman dashboard.

- Load template dasar dari library LP.
- Blok komponen: Hero, Navbar, Fitur, Testimoni, Pricing, CTA, Form, Galeri, Footer, dll.
- Edit teks inline langsung di canvas.
- Upload dan manage gambar/aset dari dalam builder.
- Pengaturan warna, font, spacing per elemen.
- **Multi-halaman**: tambah halaman baru dalam 1 project (maks 5 halaman), navigasi antar halaman di sidebar.
- Preview mode: mobile (375px) & desktop (1280px).
- Export:
  - **Download ZIP** — semua file HTML + aset dalam satu ZIP
  - **Publish ke subdomain** — langsung aktif di `namaproject.domain.com`

#### 3.3.6 Email Builder

GrapesJS dengan preset `grapesjs-preset-newsletter`, di-embed di halaman dashboard.

- Load template dasar dari library Email.
- Blok komponen email-safe: Header, Banner, Text Block, Button, Divider, 2-Column, 3-Column, Image + Text, Footer, Social Links, Unsubscribe.
- Semua komponen berbasis `<table>` untuk kompatibilitas email client.
- Edit teks inline di canvas dengan lebar terkunci 600px.
- Upload gambar ke Cloudinary/S3 — URL absolut otomatis dimasukkan ke `<img src="">`.
- **Single file** — tidak ada multi-halaman.
- Preview mode:
  - Desktop email (600px)
  - Mobile email (320px)
  - Dark mode preview
- **CSS Inliner**: saat export, semua CSS dikonversi jadi inline style via library `juice` secara otomatis.
- Export:
  - **Download file HTML** — single file dengan semua CSS inline, siap dipakai di platform email manapun
- **Test Send**: admin bisa input alamat email lalu sistem kirim versi HTML via Resend untuk dilihat di inbox nyata.

#### 3.3.7 Manajemen Template (Superadmin)

- Library template dipisah per layanan (tab LP / Email).
- Tambah, edit, nonaktifkan, atau hapus template.
- Upload template baru:
  - LP: ZIP berisi HTML + CSS + JS + assets
  - Email: file HTML tunggal (inline CSS atau belum — sistem akan inline otomatis)
- Set: nama, kategori, thumbnail, deskripsi, jenis layanan.
- Status template: `Aktif / Draft / Arsip`

#### 3.3.8 Manajemen Admin (Superadmin)

- Tambah akun admin baru (nama, email, password).
- Nonaktifkan atau hapus akun admin.
- Lihat history task yang dikerjakan tiap admin, termasuk breakdown LP vs Email.

---

### 3.4 Sistem Notifikasi

| Event | Penerima | Channel |
|---|---|---|
| Pembayaran berhasil (paid) | Superadmin + Admin | In-app badge + WhatsApp |
| Pembayaran gagal / expired | Customer | In-app + Email |
| Order LP baru (setelah paid) | Superadmin + Admin | In-app badge + WhatsApp |
| Order Email baru (setelah paid) | Superadmin + Admin | In-app badge + WhatsApp |
| Status order diupdate | Customer | In-app + Email |
| Pesan / komentar baru | Customer & Admin | In-app badge |
| Order siap di-review | Customer | In-app + Email + WhatsApp |
| Test email berhasil dikirim | Customer | In-app |
| Request revisi masuk | Admin yang ditugaskan | In-app + WhatsApp |
| Template baru diaktifkan | Superadmin | In-app |

---

## 4. Sitemap

### 4.1 Storefront & Client Portal

| Halaman | URL | Akses |
|---|---|---|
| Beranda | `/` | Publik |
| Gallery Landing Page | `/templates/landing-page` | Publik |
| Gallery Email Template | `/templates/email` | Publik |
| Detail Template | `/templates/[type]/[slug]` | Publik |
| Login Customer | `/login` | Publik |
| Register Customer | `/register` | Publik |
| Dashboard Customer | `/portal` | Customer |
| Order Baru — LP | `/portal/order/new?type=landing-page` | Customer |
| Order Baru — Email | `/portal/order/new?type=email` | Customer |
| Ringkasan & Pembayaran | `/portal/order/[id]/payment` | Customer |
| Status Pembayaran | `/portal/order/[id]/payment/status` | Customer |
| Detail Order | `/portal/order/[id]` | Customer |
| Preview LP | `/preview/[subdomain]` | Publik / Customer |
| Preview Email | `/portal/order/[id]/email-preview` | Customer |

### 4.2 Admin Dashboard

| Halaman | URL | Akses |
|---|---|---|
| Login Admin | `/admin/login` | Publik |
| Dashboard Admin | `/admin` | Admin+ |
| Daftar Task / Order | `/admin/orders` | Admin+ |
| Detail Task | `/admin/orders/[id]` | Admin+ |
| LP Builder | `/admin/builder/lp/[projectId]` | Admin+ |
| Email Builder | `/admin/builder/email/[projectId]` | Admin+ |
| Manajemen Template LP | `/admin/templates/landing-page` | Superadmin |
| Manajemen Template Email | `/admin/templates/email` | Superadmin |
| Import Template | `/admin/templates/import` | Superadmin |
| Review Import | `/admin/builder/import/[sessionId]` | Superadmin |
| Manajemen Tema | `/admin/themes` | Superadmin |
| Manajemen Admin | `/admin/users` | Superadmin |
| Pengaturan Sistem | `/admin/settings` | Superadmin |

---

## 5. Database Schema

### 5.1 Tabel `users`

| Field | Tipe | Constraint | Keterangan |
|---|---|---|---|
| id | UUID | PK | Primary key |
| name | VARCHAR(100) | NOT NULL | Nama lengkap |
| email | VARCHAR(150) | UNIQUE, NOT NULL | Email login |
| password_hash | TEXT | NOT NULL | Bcrypt hash |
| phone | VARCHAR(20) | NULLABLE | No. WhatsApp customer |
| role | ENUM | NOT NULL | `customer \| admin \| superadmin` |
| is_active | BOOLEAN | DEFAULT true | Status akun |
| created_at | TIMESTAMP | DEFAULT now() | |

### 5.2 Tabel `categories`

| Field | Tipe | Constraint | Keterangan |
|---|---|---|---|
| id | UUID | PK | |
| service_type | ENUM | NOT NULL | `landing_page \| email` — kategori ini milik layanan mana |
| name | VARCHAR(100) | NOT NULL | Misal: Fashion, F&B, Promotional, Newsletter |
| slug | VARCHAR(100) | UNIQUE | URL slug |
| icon | VARCHAR(50) | NULLABLE | Nama ikon (dari Lucide) |

### 5.3 Tabel `templates`

| Field | Tipe | Constraint | Keterangan |
|---|---|---|---|
| id | UUID | PK | |
| service_type | ENUM | NOT NULL | `landing_page \| email` — jenis layanan |
| name | VARCHAR(150) | NOT NULL | Nama template |
| slug | VARCHAR(150) | UNIQUE | URL-friendly name |
| category_id | UUID | FK → categories | Kategori |
| page_count | INTEGER | DEFAULT 1 | Jumlah halaman (LP); selalu 1 untuk email |
| email_category | ENUM | NULLABLE | `promotional \| newsletter \| welcome \| transactional \| event` — hanya untuk email |
| thumbnail_url | TEXT | NULLABLE | URL gambar preview |
| preview_url | TEXT | NULLABLE | URL live preview |
| gjs_data | JSONB | NULLABLE | Data GrapesJS (komponen & style) |
| status | ENUM | DEFAULT draft | `active \| draft \| archived` |
| created_by | UUID | FK → users | Admin yang membuat |
| created_at | TIMESTAMP | DEFAULT now() | |

### 5.4 Tabel `orders`

| Field | Tipe | Constraint | Keterangan |
|---|---|---|---|
| id | UUID | PK | |
| order_number | VARCHAR(20) | UNIQUE | Misal: EP-LP-2026-0001 atau EP-EM-2026-0001 |
| service_type | ENUM | NOT NULL | `landing_page \| email` — jenis layanan yang dipesan |
| customer_id | UUID | FK → users | Customer yang order |
| template_id | UUID | FK → templates, NULLABLE | Template yang dipilih |
| assignee_id | UUID | FK → users, NULLABLE | Admin yang ditugaskan |
| package | ENUM | NOT NULL | `basic \| custom \| premium` |
| status | ENUM | DEFAULT awaiting_payment | `awaiting_payment \| pending \| confirmed \| in_progress \| review \| done \| cancelled` |
| price | BIGINT | NOT NULL | Harga order dalam rupiah (IDR) |
| payment_status | ENUM | DEFAULT unpaid | `unpaid \| paid \| refunded \| failed` |
| brief | JSONB | NOT NULL | Isi brief dari customer (berbeda per service_type) |
| notes | TEXT | NULLABLE | Catatan tambahan |
| revision_count | INTEGER | DEFAULT 0 | Jumlah revisi yang sudah dilakukan |
| max_revisions | INTEGER | DEFAULT 2 | Batas revisi sesuai paket |
| deadline | DATE | NULLABLE | Target selesai |
| created_at | TIMESTAMP | DEFAULT now() | |
| updated_at | TIMESTAMP | DEFAULT now() | |

Struktur `brief` per layanan:

```json
// Landing Page
{
  "business_name": "Toko Kopi Nusantara",
  "description": "Kopi specialty dari petani lokal",
  "target_audience": "Pecinta kopi 20–35 tahun",
  "goal": "Jualan produk",
  "color_preference": "Coklat earth tone",
  "font_preference": "Modern serif",
  "page_count": 2
}

// Email Template
{
  "business_name": "Toko Kopi Nusantara",
  "email_type": "promotional",
  "email_goal": "Promo Lebaran diskon 30% untuk semua produk",
  "color_preference": "Coklat dan emas",
  "font_preference": "Clean sans-serif",
  "email_platform": "Mailchimp"
}
```

### 5.5 Tabel `projects` (Builder)

| Field | Tipe | Constraint | Keterangan |
|---|---|---|---|
| id | UUID | PK | |
| order_id | UUID | FK → orders, UNIQUE | 1 order = 1 project |
| service_type | ENUM | NOT NULL | `landing_page \| email` |
| name | VARCHAR(150) | NOT NULL | Nama project |
| pages | JSONB | NOT NULL | LP: array `[{name, gjs_data}]`; Email: array 1 item |
| inlined_html | TEXT | NULLABLE | Email only: hasil HTML setelah CSS di-inline via juice |
| subdomain | VARCHAR(100) | UNIQUE, NULLABLE | LP only: subdomain jika dipublish |
| published_at | TIMESTAMP | NULLABLE | LP only: waktu publish ke subdomain |
| export_url | TEXT | NULLABLE | URL download file / ZIP |
| updated_at | TIMESTAMP | DEFAULT now() | |

### 5.6 Tabel Pendukung

**`order_assets`** — upload file dari customer:
`id, order_id, uploader_id, file_url, file_name, file_type, uploaded_at`

**`messages`** — chat antara customer & admin:
`id, order_id, sender_id, content, type (text | file), created_at`

**`notifications`** — notifikasi in-app:
`id, user_id, order_id, type, message, is_read, created_at`

**`payments`** — transaksi pembayaran via Midtrans:
`id, order_id (FK → orders), midtrans_order_id (VARCHAR UNIQUE), midtrans_token (TEXT), payment_method (VARCHAR), amount (BIGINT), status (pending | success | failed | expired | refunded), paid_at (TIMESTAMP NULLABLE), created_at`

**`themes`** — preset tema dari Template Generator:
`id, name, source (manual | imported), applicable_to (landing_page | email | both), tokens (JSONB), created_by, created_at`

---

## 6. Tech Stack

| Layer | Teknologi | Keterangan |
|---|---|---|
| Frontend | **Next.js 14** (App Router) | SSR + SSG untuk storefront, CSR untuk dashboard |
| UI Framework | **Tailwind CSS + shadcn/ui** | Komponen siap pakai, desain konsisten |
| LP Builder | **GrapesJS** + `grapesjs-preset-webpage` | Drag & drop editor untuk landing page, output HTML bebas |
| Email Builder | **GrapesJS** + `grapesjs-preset-newsletter` | Drag & drop editor untuk email, output table-based HTML |
| CSS Inliner | **`juice`** (Node.js library) | Konversi CSS ke inline style untuk kompatibilitas email client |
| Payment Gateway | **Midtrans** (Snap & Core API) | VA, QRIS, GoPay, OVO, ShopeePay, kartu kredit; webhook untuk update status otomatis |
| Backend / API | **Next.js API Routes + Prisma ORM** | API handler di dalam Next.js, ORM untuk database |
| Database | **PostgreSQL** | Relational DB, dukungan JSONB untuk data GrapesJS & brief |
| Autentikasi | **NextAuth.js v5** | Session-based auth, role-based access control |
| File Storage | **Cloudinary / AWS S3** | Upload aset customer, thumbnail template, gambar email (URL absolut) |
| WhatsApp Notif | **Fonnte / Wablas API** | Notifikasi order baru ke admin via WhatsApp |
| Email Notif | **Resend** | Notifikasi status order ke customer + test send email template |
| Subdomain Hosting | **Nginx Wildcard + VPS** | `*.domain.com` untuk serve hasil LP customer |
| HTML Parser | **cheerio + css-tree** | Template Generator: parsing HTML & CSS yang diupload |
| AI Classification | **Claude API** (claude-haiku-4-5) | Template Generator Mode B: klasifikasi seksi HTML |
| Deployment App | **Vercel** (frontend) + **VPS** (subdomain server) | Pisah antara aplikasi dan server subdomain |
| Version Control | **Git + GitHub** | Source code management |

---

## 7. Alur Kerja Sistem

### 7.1 Flow Order Landing Page

```
1.  [Customer]   Buka gallery Landing Page, pilih template yang disukai.
2.  [Customer]   Klik "Order Template Ini", login/register jika belum.
3.  [Customer]   Isi form order LP: brief bisnis, jumlah halaman, upload aset, pilih paket.
4.  [Customer]   Review ringkasan order + total harga → klik "Bayar Sekarang".
5.  [Sistem]     Buat transaksi Midtrans → tampilkan Snap payment page.
                 (VA, QRIS, GoPay, OVO, ShopeePay, kartu kredit)
6.  [Customer]   Selesaikan pembayaran.
7.  [Midtrans]   Kirim webhook ke sistem → payment_status: "paid",
                 order status: "Menunggu Konfirmasi".
                 Notifikasi ke superadmin via in-app + WhatsApp.
8.  [Superadmin] Login dashboard, assign task ke admin, ubah status ke "Dikerjakan".
9.  [Admin]      Buka detail task, download aset customer, klik "Buka LP Builder".
10. [Admin]      Di GrapesJS Webpage: load template, kustomisasi konten & aset.
                 Tambah halaman jika diperlukan (maks 5 halaman).
11. [Admin]      Selesai → ubah status ke "Review".
12. [Admin]      Export: (a) publish ke subdomain ATAU (b) export ZIP file HTML.
13. [Customer]   Buka client portal, lihat preview.
                 → Setuju: lanjut ke langkah 16.
                 → Revisi: lanjut ke langkah 14.
14. [Customer]   Klik "Request Revisi", isi keterangan.
15. [Admin]      Perbaiki di builder, update status ke "Review".
16. [Customer]   Setujui, download ZIP untuk upload ke hosting sendiri.
17. [Sistem]     Status order → "Selesai".
```

### 7.2 Flow Order Email Template

```
1.  [Customer]   Buka gallery Email Template, pilih template yang disukai.
2.  [Customer]   Klik "Order Template Ini", login/register jika belum.
3.  [Customer]   Isi form order Email: brief, jenis email, platform email, upload aset.
4.  [Customer]   Review ringkasan order + total harga → klik "Bayar Sekarang".
5.  [Sistem]     Buat transaksi Midtrans → tampilkan Snap payment page.
6.  [Customer]   Selesaikan pembayaran.
7.  [Midtrans]   Kirim webhook ke sistem → payment_status: "paid",
                 order status: "Menunggu Konfirmasi".
                 Notifikasi ke superadmin via in-app + WhatsApp.
8.  [Superadmin] Login dashboard, assign task ke admin, ubah status ke "Dikerjakan".
9.  [Admin]      Buka detail task, download aset customer, klik "Buka Email Builder".
10. [Admin]      Di GrapesJS Newsletter: load template, kustomisasi konten.
                 Semua gambar diupload ke CDN — URL absolut otomatis terpasang.
11. [Admin]      Selesai → klik "Export & Inline CSS".
                 Sistem proses file HTML via juice — semua CSS jadi inline.
12. [Admin]      Opsional: kirim test ke email sendiri untuk verifikasi tampilan.
                 Jika tampilan oke → ubah status ke "Review".
13. [Customer]   Buka client portal, lihat preview email template.
                 Bisa request "Kirim Test ke Email Saya" untuk melihat di inbox.
                 → Setuju: lanjut ke langkah 16.
                 → Revisi: lanjut ke langkah 14.
14. [Customer]   Klik "Request Revisi", isi keterangan.
15. [Admin]      Perbaiki di builder, re-export & inline ulang, update status ke "Review".
16. [Customer]   Setujui, download file HTML.
17. [Sistem]     Status order → "Selesai".
```

### 7.3 Flow Penambahan Template ke Library

Digunakan ketika superadmin ingin menambah template baru ke library — baik dibeli dari vendor luar maupun dibuat sendiri dari nol.

```
── Jalur A: Dibuat dari nol di builder ──────────────────────────

1.  [Superadmin] Buka /admin/templates → klik "Buat Template Baru".
2.  [Superadmin] Isi metadata: nama, jenis layanan (LP / Email),
                 kategori, deskripsi, jumlah halaman (LP).
3.  [Sistem]     Buat project builder kosong → redirect ke builder yang sesuai.
4.  [Superadmin] Desain template dari nol di LP Builder atau Email Builder.
5.  [Superadmin] Klik "Simpan sebagai Template" → status otomatis: "Draft".
6.  [Superadmin] Upload thumbnail (screenshot atau export otomatis via builder).
7.  [Superadmin] Preview template di storefront (mode draft, tidak tampil ke publik).
8.  [Superadmin] Jika sudah oke → ubah status ke "Aktif".
9.  [Sistem]     Template muncul di gallery storefront.

── Jalur B: Import dari file HTML (Template Generator) ──────────

1.  [Superadmin] Buka /admin/templates/import.
2.  [Superadmin] Pilih jenis layanan (LP / Email), upload file HTML atau ZIP.
3.  [Sistem]     Jalankan parser (Mode A: style extraction, Mode B: full import).
4a. [Mode A]     Hasil: preset tema baru tersimpan — bisa diaplikasikan di builder
                 template yang sudah ada.
4b. [Mode B]     Hasil: struktur HTML dikonversi ke GrapesJS component JSON.
                 Sistem redirect ke builder untuk review.
5.  [Superadmin] Di builder: verifikasi hasil konversi, edit jika ada yang kurang pas.
6.  [Superadmin] Isi metadata: nama, kategori, deskripsi, thumbnail.
7.  [Superadmin] Simpan → status: "Draft".
8.  [Superadmin] Preview & verifikasi tampilan akhir.
9.  [Superadmin] Aktifkan → template muncul di gallery storefront.

── Jalur C: Duplikasi dari template yang sudah ada ──────────────

1.  [Superadmin] Di daftar template, klik "Duplikasi" pada template yang diinginkan.
2.  [Sistem]     Buat salinan template dengan status "Draft" dan nama "Copy of [nama]".
3.  [Superadmin] Buka builder, modifikasi sesuai kebutuhan (variasi warna, layout, dll.).
4.  [Superadmin] Ganti nama, update metadata & thumbnail.
5.  [Superadmin] Aktifkan → tersedia di gallery.
```

---

## 8. Paket Layanan

### 8.1 Paket Landing Page

| | **Dasar** | **Custom** | **Premium** |
|---|---|---|---|
| Template | Pilih dari library | Desain dari nol | Desain premium |
| Jumlah Halaman | 1 halaman | Sampai 3 halaman | Sampai 5 halaman |
| Aset & Tema | Milik customer | Dibuat dari nol | Lengkap + branded |
| Revisi | 1x | 2x | 3x |
| Output | File HTML | File HTML atau subdomain | Subdomain + file HTML |
| Estimasi | 1–2 hari kerja | 3–5 hari kerja | 5–7 hari kerja |

### 8.2 Paket Email Template

| | **Dasar** | **Custom** | **Premium** |
|---|---|---|---|
| Template | Pilih dari library | Desain dari nol | Desain premium |
| Jenis Email | 1 jenis email | 1 jenis email | Sampai 3 variasi email |
| Aset & Konten | Milik customer | Dibuat dari nol | Lengkap + branded |
| Kompatibilitas | Gmail, Apple Mail | + Outlook | Semua major clients |
| Test Send | 1x | 2x | 3x (termasuk dark mode) |
| Revisi | 1x | 2x | 3x |
| Output | File HTML inline CSS | File HTML inline CSS | File HTML + panduan integrasi platform |
| Estimasi | 1 hari kerja | 2–3 hari kerja | 3–5 hari kerja |

> Catatan: Harga disesuaikan dengan kondisi pasar dan tidak dicantumkan dalam dokumen ini.

---

## 9. Estimasi Development

Estimasi berdasarkan 1–2 developer full-stack:

| Modul | Deskripsi | Estimasi |
|---|---|---|
| Setup & Infrastruktur | Inisialisasi Next.js, DB, Auth, CI/CD, VPS wildcard subdomain | 3–4 hari |
| Database & API | Skema Prisma, semua API endpoint (order, user, template, project, payment) | 5–7 hari |
| Payment Gateway | Integrasi Midtrans Snap + Core API, webhook handler, halaman status pembayaran | 3–4 hari |
| Storefront | Beranda (2 layanan), gallery LP, gallery Email, detail template, login/register | 7–9 hari |
| Client Portal | Dashboard customer, form order LP & Email, payment flow, detail order, chat | 6–8 hari |
| Admin Dashboard | Task list, detail task, revenue stats, manajemen template (LP & Email), manajemen user | 5–7 hari |
| LP Builder | Integrasi GrapesJS Webpage, multi-page, export ZIP, publish subdomain | 6–8 hari |
| Email Builder | Integrasi GrapesJS Newsletter, CSS inliner (juice), test send via Resend | 6–8 hari |
| Notifikasi | In-app badge, WhatsApp (Fonnte), Email notif (Resend) | 2–3 hari |
| Testing & QA | Unit test, E2E test, cross-browser, cross-email-client test, payment flow test | 5–7 hari |
| **Total Estimasi** | | **48–65 hari kerja** |

---

## 10. Non-Functional Requirements

### 10.1 Performa

- Halaman storefront harus load dalam < 3 detik (LCP).
- API response time < 500ms untuk operasi CRUD standar.
- LP Builder mampu handle project 5 halaman + 50 komponen tanpa lag.
- Proses CSS inlining (juice) untuk email selesai dalam < 5 detik.

### 10.2 Keamanan

- Semua password di-hash dengan bcrypt (min cost 12).
- API endpoints dilindungi dengan session token (NextAuth).
- Upload file dibatasi tipe dan ukuran (maks 50MB per upload).
- Gambar email wajib di-host di CDN dengan URL absolut — tidak boleh embed base64 (ukuran email membengkak).
- Subdomain LP customer diisolasi per project.
- Admin dashboard tidak bisa diakses dari route publik selain `/admin/login`.

### 10.3 Kompatibilitas Email

Email output wajib kompatibel dengan:
- Gmail (web & mobile)
- Apple Mail (iOS & macOS)
- Outlook 2016, 2019, 365 (Windows)
- Yahoo Mail
- Samsung Mail

Pengujian kompatibilitas dilakukan manual menggunakan akun test di masing-masing client, atau menggunakan tools seperti Litmus (opsional, berbayar).

### 10.4 Skalabilitas

- PostgreSQL dengan indexing pada: `service_type`, `status`, `customer_id`, `assignee_id`, `created_at`.
- File storage via CDN (Cloudinary/S3) agar tidak bergantung pada server utama.
- Builder dimuat secara lazy (code splitting) agar tidak memperlambat halaman lain.

### 10.5 Responsivitas

- Storefront responsif di mobile, tablet, dan desktop.
- Client portal responsif di mobile dan desktop.
- Admin dashboard dioptimalkan untuk desktop (1024px ke atas).
- LP Builder minimal bisa diakses di layar 1280px.
- Email Builder minimal bisa diakses di layar 1024px (canvas lebih kecil: 600px).

---

## 11. Template Generator — HTML Importer

### 11.1 Latar Belakang

Superadmin dapat membeli atau mendapatkan template HTML dari layanan pihak ketiga (ThemeForest, TemplateMonster, Stripo, dll.), lalu mengimpornya ke dalam sistem untuk dijadikan template milik ersya projects. Berlaku untuk kedua jenis layanan — LP dan Email. Fitur ini memungkinkan library template berkembang dengan cepat tanpa harus mendesain dari nol.

### 11.2 Dua Mode Import

#### Mode A — Style Extraction *(Phase 2 — prioritas utama)*

> Upload HTML → ekstrak design tokens → simpan sebagai **preset tema baru** yang bisa diaplikasikan ke template manapun di builder.

Yang diekstrak:
- **Palet warna** — semua nilai hex/rgb/hsl dari CSS (inline, style tag, CSS variables)
- **Tipografi** — font-family, ukuran heading/body, font-weight dominan
- **Border radius** — menentukan karakter visual (rounded vs sharp)
- **Shadow style** — flat vs elevated
- **Spacing pattern** — nilai padding/margin yang paling sering digunakan

Hasil: tema baru tersimpan di database sebagai JSON design tokens, dan bisa dipilih admin saat membuka builder ("Ganti Tema"). Field `applicable_to` menentukan apakah tema bisa dipakai di LP builder, Email builder, atau keduanya.

#### Mode B — Full Template Import *(Phase 3)*

> Upload HTML → parser + AI mengenali setiap seksi → dikonversi menjadi **blok GrapesJS yang bisa diedit**.

Berlaku untuk:
- **LP**: HTML multi-section → GrapesJS Webpage components
- **Email**: HTML table-based → GrapesJS Newsletter components

Yang terjadi di balik layar:
1. HTML di-parse, dibersihkan dari script berbahaya (sanitize).
2. Sistem deteksi otomatis apakah HTML adalah LP atau Email (berdasarkan struktur: table-heavy = email, div-heavy = LP).
3. Setiap blok DOM dianalisis strukturnya.
4. Claude API memberi label pada tiap seksi sesuai jenis layanan.
5. Tiap seksi dikonversi ke format GrapesJS component JSON yang sesuai (webpage atau newsletter).
6. Admin melakukan review & touch-up di builder yang sesuai sebelum template disimpan.

### 11.3 Alur Kerja (Admin)

```
1. [Superadmin]  Buka halaman "Import Template" di dashboard.
2. [Superadmin]  Pilih jenis layanan: Landing Page atau Email.
                 Upload file HTML (wajib) + CSS opsional + assets (sebagai ZIP).
3. [Sistem]      Parsing dimulai di background — progress bar tampil.

   ─── Mode A (Style Extraction) ───────────────────────────
4a. [Sistem]     Ekstrak semua design tokens dari HTML & CSS.
5a. [Sistem]     Generate preview palet warna, font, dan spacing.
6a. [Superadmin] Beri nama tema, pilih applicable_to (LP / Email / Keduanya).
7a. [Sistem]     Simpan sebagai preset tema baru — langsung tersedia di builder.

   ─── Mode B (Full Import) ────────────────────────────────
4b. [Sistem]     Parse DOM, deteksi jenis (LP atau Email).
5b. [Sistem]     Kirim struktur HTML ke Claude API untuk klasifikasi seksi.
6b. [Claude API] Return label + mapping tiap blok ke GrapesJS component.
7b. [Sistem]     Render hasil di builder yang sesuai (LP atau Email builder).
8b. [Superadmin] Review, edit manual jika perlu, lalu simpan sebagai template baru.
9b. [Sistem]     Template tersimpan dengan status "Draft" (perlu aktivasi).
```

### 11.4 Spesifikasi Teknis

#### Parser Layer (Mode A & B)

| Komponen | Teknologi | Fungsi |
|---|---|---|
| HTML Parser | `cheerio` | Parse DOM tree dari file yang diupload |
| CSS Parser | `css-tree` | Ekstrak semua rule & value dari style tag / file CSS |
| Color Extractor | Custom regex + `chroma.js` | Temukan semua warna, sort by frequency, buat palet |
| Font Detector | CSS parser + Google Fonts API | Identifikasi font family yang digunakan |
| Sanitizer | `DOMPurify` (server-side) | Buang script berbahaya, event handler, iframe |
| Type Detector | Heuristik DOM | Deteksi otomatis LP vs Email (table ratio, max-width, dll.) |

#### AI Classification Layer (Mode B)

| Komponen | Teknologi | Fungsi |
|---|---|---|
| Section Labeler | **Claude API** (claude-haiku-4-5) | Terima struktur HTML per blok, return label seksi |
| GrapesJS Converter — LP | Custom mapper | Konversi HTML blok → GrapesJS Webpage component JSON |
| GrapesJS Converter — Email | Custom mapper | Konversi table HTML → GrapesJS Newsletter component JSON |

### 11.5 Batasan & Catatan Penting

| Kondisi | Dampak & Penanganan |
|---|---|
| CSS di file eksternal terpisah | Upload sebagai ZIP (HTML + CSS + assets sekaligus) |
| LP pakai Bootstrap / Tailwind | Style framework tidak ikut; ekstraksi tetap bisa ambil custom value |
| Email HTML sudah pakai inline CSS | Langsung bisa diproses; parser tetap jalan normal |
| JavaScript-heavy LP | Animasi/interaksi JS mungkin tidak jalan di dalam GrapesJS; notifikasi admin |
| HTML tidak semantik | Mode B akurasi turun; butuh review manual lebih banyak |
| LP multi-file (3 halaman HTML) | Upload sebagai ZIP; parser proses tiap file sebagai satu halaman project |

### 11.6 Estimasi Development Tambahan

| Komponen | Estimasi |
|---|---|
| Mode A: HTML/CSS parser + color/font extractor (LP & Email) | 3–4 hari |
| Mode A: UI import + preview tema + simpan ke DB | 2–3 hari |
| Mode B: Integrasi Claude API + section labeler (LP & Email) | 3–4 hari |
| Mode B: GrapesJS converter LP + review UI | 3–4 hari |
| Mode B: GrapesJS converter Email + review UI | 3–4 hari |
| **Total tambahan** | **14–19 hari kerja** |

---

*Dokumen ini bersifat living document dan akan diperbarui seiring perkembangan produk.*
