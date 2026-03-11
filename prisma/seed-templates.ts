import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const ADMIN_ID = 'f5d4ede5-392c-4c7a-b42c-0cbcf00b9404'

// Category IDs
const CAT = {
  fashion:      'f1206b3b-ceb5-4f28-91f8-c3e754731921',
  fnb:          'ce312e72-6251-4a84-b029-88e65cf6891e',
  jasa:         '99d469cd-ee3a-4d17-93f4-c3ec65f60da0',
  edukasi:      '5c80c16f-79a6-4925-aedc-c16ed65de912',
  properti:     '9d91cd53-a1e5-4639-95a1-6775402bd8ec',
  kesehatan:    '0c69357c-5951-419c-bca3-d06fad768c4f',
  teknologi:    'ac1eb028-34c3-4610-895d-1c1ec7aeaeb2',
  event:        '7294b733-4d61-4736-9637-d4dd7dcd27e0',
  lainnya:      '0c3b6321-610c-4384-91ba-1cc276357cda',
  emailPromo:   '079d2ca1-3e9e-4fa5-b856-f2daaf07c161',
  emailNewsletter: '61c7c732-387a-4bd0-a5da-33f0560979fb',
  emailWelcome: '772ae21b-5402-4fe3-ab35-2542c0d26134',
  emailCart:    '025b05d7-e926-4745-bad6-bf510675592a',
}

// LP template as plain HTML (stored as { __html, __css } for GrapesBuilder compatibility)
function makeLpGjs(accentColor: string, headline: string, subheadline: string) {
  const css = `* { box-sizing: border-box; } body { margin: 0; font-family: system-ui, -apple-system, sans-serif; }`
  const html = `
<section style="background:${accentColor};padding:80px 20px;text-align:center;">
  <h1 style="color:#fff;font-size:2.5rem;font-weight:700;margin:0 0 16px;">${headline}</h1>
  <p style="color:rgba(255,255,255,.85);font-size:1.1rem;margin:0 0 32px;">${subheadline}</p>
  <a href="#" style="background:#fff;color:${accentColor};padding:14px 36px;border-radius:8px;font-weight:700;text-decoration:none;font-size:1rem;">Hubungi Kami</a>
</section>

<section style="padding:60px 20px;max-width:900px;margin:0 auto;">
  <h2 style="text-align:center;font-size:1.8rem;margin-bottom:40px;">Mengapa Pilih Kami?</h2>
  <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:24px;">
    <div style="background:#f8f9fa;border-radius:12px;padding:28px 20px;text-align:center;">
      <div style="width:48px;height:48px;background:${accentColor};border-radius:50%;margin:0 auto 16px;"></div>
      <h3 style="font-size:1rem;font-weight:700;margin:0 0 8px;">Kualitas Terjamin</h3>
      <p style="color:#666;font-size:.9rem;margin:0;">Deskripsi fitur unggulan kami yang membedakan dari kompetitor.</p>
    </div>
    <div style="background:#f8f9fa;border-radius:12px;padding:28px 20px;text-align:center;">
      <div style="width:48px;height:48px;background:${accentColor};border-radius:50%;margin:0 auto 16px;"></div>
      <h3 style="font-size:1rem;font-weight:700;margin:0 0 8px;">Pengiriman Cepat</h3>
      <p style="color:#666;font-size:.9rem;margin:0;">Deskripsi fitur unggulan kami yang membedakan dari kompetitor.</p>
    </div>
    <div style="background:#f8f9fa;border-radius:12px;padding:28px 20px;text-align:center;">
      <div style="width:48px;height:48px;background:${accentColor};border-radius:50%;margin:0 auto 16px;"></div>
      <h3 style="font-size:1rem;font-weight:700;margin:0 0 8px;">Harga Terbaik</h3>
      <p style="color:#666;font-size:.9rem;margin:0;">Deskripsi fitur unggulan kami yang membedakan dari kompetitor.</p>
    </div>
  </div>
</section>

<section style="background:${accentColor}22;padding:60px 20px;text-align:center;">
  <h2 style="font-size:1.8rem;margin:0 0 12px;">Siap Memulai?</h2>
  <p style="color:#555;margin:0 0 28px;">Hubungi kami sekarang dan dapatkan konsultasi gratis.</p>
  <a href="#" style="background:${accentColor};color:#fff;padding:14px 36px;border-radius:8px;font-weight:700;text-decoration:none;">Mulai Sekarang</a>
</section>

<footer style="background:#222;color:#aaa;padding:24px 20px;text-align:center;font-size:.85rem;">
  © 2026 Brand Name. All rights reserved.
</footer>`.trim()
  return { __html: html, __css: css }
}

// Email template as plain HTML (stored as { __html, __css } for GrapesBuilder compatibility)
// Outer wrapper intentionally omitted — canvas body background is injected by GrapesBuilder
function makeEmailGjs(accentColor: string, headline: string, previewText: string) {
  const css = `* { box-sizing: border-box; }`
  const html = `
<table width="600" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:12px;overflow:hidden;margin:0 auto;">
  <tr>
    <td style="background:${accentColor};padding:32px 40px;text-align:center;">
      <h1 style="color:#fff;font-size:1.8rem;margin:0;">Brand Name</h1>
    </td>
  </tr>
  <tr>
    <td style="padding:40px;">
      <h2 style="font-size:1.4rem;margin:0 0 16px;">${headline}</h2>
      <p style="color:#555;line-height:1.7;margin:0 0 24px;">${previewText}</p>
      <a href="#" style="display:inline-block;background:${accentColor};color:#fff;padding:14px 32px;border-radius:8px;font-weight:700;text-decoration:none;">Lihat Selengkapnya</a>
    </td>
  </tr>
  <tr>
    <td style="background:#f8f8f8;padding:20px 40px;text-align:center;color:#aaa;font-size:.8rem;">
      Anda menerima email ini karena terdaftar di layanan kami. Berhenti berlangganan
    </td>
  </tr>
</table>`.trim()
  return { __html: html, __css: css }
}

const LP_TEMPLATES = [
  {
    name: 'FoodieBox — Katering & Makanan',
    slug: 'foodiebox-katering',
    categoryId: CAT.fnb,
    description: 'Template modern untuk bisnis katering, restoran, dan usaha makanan. Dilengkapi section menu, testimoni, dan form pemesanan.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&h=450&fit=crop',
    accentColor: '#e85d04',
    headline: 'Katering Lezat untuk Acara Spesial Anda',
    subheadline: 'Kami menyajikan hidangan terbaik dengan bahan segar pilihan untuk setiap momen berharga Anda.',
  },
  {
    name: 'StyleCo — Fashion & Apparel',
    slug: 'styleco-fashion',
    categoryId: CAT.fashion,
    description: 'Template elegan untuk brand fashion, toko baju, dan apparel. Menampilkan produk dengan visual yang kuat dan call-to-action yang jelas.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=600&h=450&fit=crop',
    accentColor: '#1a1a2e',
    headline: 'Tampil Percaya Diri Setiap Hari',
    subheadline: 'Koleksi fashion terkini untuk wanita modern yang stylish dan berkelas.',
  },
  {
    name: 'ProService — Jasa Profesional',
    slug: 'proservice-jasa',
    categoryId: CAT.jasa,
    description: 'Template bersih dan profesional untuk konsultan, agensi, dan penyedia jasa. Menonjolkan kepercayaan dan track record.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&h=450&fit=crop',
    accentColor: '#2563eb',
    headline: 'Solusi Profesional untuk Bisnis Anda',
    subheadline: 'Kami membantu bisnis Anda berkembang dengan layanan konsultasi dan solusi yang tepat sasaran.',
  },
  {
    name: 'EduClass — Kursus Online',
    slug: 'educlass-kursus',
    categoryId: CAT.edukasi,
    description: 'Template untuk platform kursus, lembaga pelatihan, dan jasa bimbingan belajar. Highlight kurikulum, instruktur, dan testimoni siswa.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=600&h=450&fit=crop',
    accentColor: '#7c3aed',
    headline: 'Belajar Lebih Efektif, Hasil Lebih Maksimal',
    subheadline: 'Program kursus terstruktur dengan instruktur berpengalaman untuk membantu Anda naik level.',
  },
  {
    name: 'GlowSkin — Klinik Kecantikan',
    slug: 'glowskin-kecantikan',
    categoryId: CAT.kesehatan,
    description: 'Template lembut dan elegan untuk klinik kecantikan, salon, dan spa. Menampilkan layanan perawatan dan promo menarik.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600&h=450&fit=crop',
    accentColor: '#ec4899',
    headline: 'Tampil Cantik Alami dari Dalam',
    subheadline: 'Perawatan kulit terbaik dengan teknologi modern dan bahan-bahan alami pilihan.',
  },
  {
    name: 'TechLaunch — Startup & SaaS',
    slug: 'techlaunch-startup',
    categoryId: CAT.teknologi,
    description: 'Template modern untuk startup teknologi, produk SaaS, dan aplikasi digital. Desain bersih dengan fokus pada fitur produk.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=600&h=450&fit=crop',
    accentColor: '#0ea5e9',
    headline: 'Platform Digital untuk Bisnis Masa Depan',
    subheadline: 'Otomatiskan alur kerja Anda dan tingkatkan produktivitas tim dengan solusi teknologi kami.',
  },
  {
    name: 'WeddingDay — Undangan Pernikahan',
    slug: 'weddingday-undangan',
    categoryId: CAT.event,
    description: 'Template romantis untuk undangan pernikahan digital. Elegant dan berkesan dengan desain yang personal.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=600&h=450&fit=crop',
    accentColor: '#b5838d',
    headline: 'Bersama Selamanya',
    subheadline: 'Dengan penuh kebahagiaan, kami mengundang Anda untuk hadir dan menjadi bagian dari momen terindah kami.',
  },
  {
    name: 'PropertyPro — Properti & Real Estate',
    slug: 'propertypro-realestate',
    categoryId: CAT.properti,
    description: 'Template premium untuk agen properti, pengembang perumahan, dan jasa sewa. Tampilkan listing properti dengan profesional.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&h=450&fit=crop',
    accentColor: '#059669',
    headline: 'Temukan Rumah Impian Anda',
    subheadline: 'Ratusan pilihan properti terbaik dengan lokasi strategis dan harga yang kompetitif.',
  },
]

const EMAIL_TEMPLATES = [
  {
    name: 'Flash Sale — Promo Akhir Tahun',
    slug: 'email-flash-sale-promo',
    categoryId: CAT.emailPromo,
    emailCategory: 'promotional' as const,
    description: 'Template email promosi untuk flash sale, diskon besar, dan penawaran terbatas waktu.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=600&h=450&fit=crop',
    accentColor: '#dc2626',
    headline: '🔥 Flash Sale! Diskon Hingga 70%',
    previewText: 'Jangan lewatkan penawaran terbatas ini! Belanja sekarang dan hemat hingga 70% untuk produk-produk pilihan.',
  },
  {
    name: 'Monthly Digest — Newsletter Bulanan',
    slug: 'email-monthly-newsletter',
    categoryId: CAT.emailNewsletter,
    emailCategory: 'newsletter' as const,
    description: 'Template newsletter bulanan yang bersih dan informatif untuk berbagi update, artikel, dan insight bisnis.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1586339949916-3e9457bef6d3?w=600&h=450&fit=crop',
    accentColor: '#2563eb',
    headline: 'Update Bulan Ini: Yang Perlu Anda Tahu',
    previewText: 'Ringkasan berita terbaik, tips berguna, dan update produk terbaru yang kami siapkan khusus untuk Anda bulan ini.',
  },
  {
    name: 'Welcome Onboard — Email Selamat Datang',
    slug: 'email-welcome-onboard',
    categoryId: CAT.emailWelcome,
    emailCategory: 'welcome' as const,
    description: 'Template email selamat datang untuk user baru. Hangat, personal, dan memandu langkah pertama.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&h=450&fit=crop',
    accentColor: '#16a34a',
    headline: 'Selamat Datang di Keluarga Kami! 🎉',
    previewText: 'Terima kasih sudah bergabung! Akun Anda sudah aktif dan siap digunakan. Yuk, mulai jelajahi fitur-fitur unggulan kami.',
  },
  {
    name: 'Cart Reminder — Keranjang Ditinggalkan',
    slug: 'email-cart-reminder',
    categoryId: CAT.emailCart,
    emailCategory: 'transactional' as const,
    description: 'Template email pengingat keranjang yang ditinggalkan untuk meningkatkan konversi penjualan.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=450&fit=crop',
    accentColor: '#f59e0b',
    headline: 'Hei, Anda Meninggalkan Sesuatu! 🛒',
    previewText: 'Keranjang belanja Anda masih menunggu! Selesaikan pembelian sekarang sebelum stok habis.',
  },
]

async function main() {
  console.log('🌱 Seeding dummy templates...')

  let lpCount = 0
  for (const t of LP_TEMPLATES) {
    const gjsData = makeLpGjs(t.accentColor, t.headline, t.subheadline)
    await prisma.template.upsert({
      where: { slug: t.slug },
      update: { gjsData },
      create: {
        name: t.name,
        slug: t.slug,
        categoryId: t.categoryId,
        serviceType: 'landing_page',
        description: t.description,
        thumbnailUrl: t.thumbnailUrl,
        gjsData,
        status: 'active',
        createdById: ADMIN_ID,
      },
    })
    lpCount++
    console.log(`  ✅ LP: ${t.name}`)
  }

  let emailCount = 0
  for (const t of EMAIL_TEMPLATES) {
    const gjsData = makeEmailGjs(t.accentColor, t.headline, t.previewText)
    await prisma.template.upsert({
      where: { slug: t.slug },
      update: { gjsData },
      create: {
        name: t.name,
        slug: t.slug,
        categoryId: t.categoryId,
        serviceType: 'email',
        emailCategory: t.emailCategory,
        description: t.description,
        thumbnailUrl: t.thumbnailUrl,
        gjsData,
        status: 'active',
        createdById: ADMIN_ID,
      },
    })
    emailCount++
    console.log(`  ✅ Email: ${t.name}`)
  }

  console.log(`\n🎉 Selesai! ${lpCount} LP + ${emailCount} Email template dibuat.`)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
