import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'AVA Voucher',
  description: 'Voucher Management System',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Ensure CSS is loaded with proper priority */}
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body suppressHydrationWarning>{children}</body>
    </html>
  )
}

