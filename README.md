# ersya projects

Platform jasa pembuatan landing page & email template profesional.

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Setup environment variables
cp .env.example .env.local
# Edit .env.local dengan credentials Anda

# 3. Setup database
npm run db:push      # Push schema ke database
npm run db:seed      # Isi data awal (superadmin + kategori)

# 4. Jalankan development server
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000)

Login admin: `admin@ersya.id` / `Admin@12345`

## Struktur Dokumen

```
docs/
├── PRD_v1.3.1.md       # Product Requirements Document
├── TECHNICAL_SPEC.md   # Spesifikasi teknis & panduan integrasi
├── schema.prisma       # Referensi database schema
└── .env.example        # Template environment variables (copy ke root)
```

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Database**: PostgreSQL + Prisma ORM
- **Auth**: NextAuth.js v5
- **Builder**: GrapesJS (Webpage + Newsletter preset)
- **Payment**: Midtrans Snap
- **Storage**: Cloudinary
- **Email**: Resend
- **WhatsApp**: Fonnte
- **UI**: Tailwind CSS + shadcn/ui

## Scripts

| Script | Deskripsi |
|---|---|
| `npm run dev` | Development server |
| `npm run build` | Build production |
| `npm run db:push` | Push schema tanpa migration |
| `npm run db:migrate` | Buat migration baru |
| `npm run db:seed` | Isi data awal |
| `npm run db:studio` | Buka Prisma Studio |
