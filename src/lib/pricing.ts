export const LP_PRICES: Record<string, number> = {
  basic: 150_000,
  standard: 300_000,
  premium: 600_000,
}

export const EMAIL_PRICES: Record<string, number> = {
  basic: 100_000,
  standard: 200_000,
  premium: 400_000,
}

export function getPrice(serviceType: 'landing_page' | 'email', pkg: string): number {
  return serviceType === 'email'
    ? EMAIL_PRICES[pkg] ?? 0
    : LP_PRICES[pkg] ?? 0
}

export function formatRupiah(amount: number | bigint) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(Number(amount))
}
