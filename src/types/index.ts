// Re-export semua types dari Prisma
export type {
  User, Order, Template, Category, Project, Payment,
  OrderAsset, Message, Notification, Theme,
  Role, ServiceType, OrderStatus, PaymentStatus,
  Package, TemplateStatus, EmailCategory,
} from '@prisma/client'

// ── Brief types ──────────────────────────────────────────────

export interface LandingPageBrief {
  business_name: string
  description: string
  target_audience: string
  goal: 'jualan_produk' | 'leads' | 'portofolio' | 'event' | 'lainnya'
  color_preference: string
  font_preference: string
  page_count: 1 | 2 | 3 | 4 | 5
}

export interface EmailBrief {
  business_name: string
  email_type: 'promotional' | 'newsletter' | 'welcome' | 'transactional' | 'event'
  email_goal: string
  color_preference: string
  font_preference: string
  email_platform: string
}

// ── GrapesJS types ───────────────────────────────────────────

export interface GjsPage {
  name: string
  gjsData: {
    components?: unknown[]
    styles?: unknown[]
    [key: string]: unknown
  }
}

// ── API response types ────────────────────────────────────────

export interface ApiSuccess<T> {
  success: true
  data: T
}

export interface ApiError {
  success: false
  error: { code: string; message: string }
}

export interface PaginatedData<T> {
  items: T[]
  total: number
  page: number
  limit: number
}

// ── Theme token types ─────────────────────────────────────────

export interface ThemeTokens {
  colors: {
    primary: string
    secondary: string
    background: string
    text: string
    accent: string
  }
  typography: {
    heading_font: string
    body_font: string
    base_size: string
    heading_weight: string
  }
  spacing: {
    section_padding: string
    container_max_width: string
  }
  radius: string
  shadow: string
}
