import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // ── Superadmin default ────────────────────────────────────────
  const hash = await bcrypt.hash('Admin@12345', 12)
  await prisma.user.upsert({
    where: { email: 'admin@ersya-projects.id' },
    update: {},
    create: {
      name: 'Super Admin',
      email: 'admin@ersya-projects.id',
      passwordHash: hash,
      role: 'superadmin',
    },
  })
  console.log('✅ Superadmin created: admin@ersya-projects.id / Admin@12345')

  // ── Kategori Landing Page ─────────────────────────────────────
  const lpCategories = [
    { name: 'Fashion & Apparel', slug: 'fashion', icon: 'Shirt' },
    { name: 'Makanan & Minuman', slug: 'fnb', icon: 'UtensilsCrossed' },
    { name: 'Jasa & Profesional', slug: 'jasa', icon: 'Briefcase' },
    { name: 'Kursus & Edukasi', slug: 'edukasi', icon: 'GraduationCap' },
    { name: 'Properti', slug: 'properti', icon: 'Building2' },
    { name: 'Kesehatan & Kecantikan', slug: 'kesehatan', icon: 'Heart' },
    { name: 'Teknologi', slug: 'teknologi', icon: 'Laptop' },
    { name: 'Event & Undangan', slug: 'event', icon: 'CalendarDays' },
    { name: 'Lainnya', slug: 'lainnya', icon: 'LayoutGrid' },
  ]

  for (const cat of lpCategories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: { ...cat, serviceType: 'landing_page' },
    })
  }
  console.log(`✅ ${lpCategories.length} kategori Landing Page created`)

  // ── Kategori Email Template ───────────────────────────────────
  const emailCategories = [
    { name: 'Promotional', slug: 'email-promo', icon: 'Tag' },
    { name: 'Newsletter', slug: 'email-newsletter', icon: 'Newspaper' },
    { name: 'Welcome Email', slug: 'email-welcome', icon: 'HandshakeIcon' },
    { name: 'Transactional', slug: 'email-transactional', icon: 'Receipt' },
    { name: 'Event & Undangan (Email)', slug: 'email-event', icon: 'CalendarDays' },
    { name: 'Abandoned Cart', slug: 'email-cart', icon: 'ShoppingCart' },
  ]

  for (const cat of emailCategories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: { ...cat, serviceType: 'email' },
    })
  }
  console.log(`✅ ${emailCategories.length} kategori Email Template created`)

  console.log('🎉 Seed selesai!')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
