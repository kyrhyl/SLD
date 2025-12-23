import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Road Inventory Straightline Diagram',
  description: 'Interactive straightline diagram showing road inventory, paved sections, proposed projects, and funding releases',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
