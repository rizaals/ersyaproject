import { Logo } from '@/components/shared/Logo'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-brand-subtle via-background to-background p-4">
      <div className="mb-8">
        <Logo size="lg" />
      </div>
      <div className="w-full max-w-sm">{children}</div>
    </div>
  )
}
