import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Order System',
  description: 'タブレット注文システム',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  )
} 