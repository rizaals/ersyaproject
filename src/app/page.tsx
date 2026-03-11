// Redirect root ke storefront beranda
import { redirect } from 'next/navigation'

export default function RootPage() {
  redirect('/home')
}
