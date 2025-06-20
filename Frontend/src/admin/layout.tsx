import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Sidebar from './components/Sidebar'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Admin Dashboard',
  description: 'Service Booking Admin Dashboard',
}

// This ensures this layout is treated as the admin layout
export const dynamic = 'force-static'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} flex bg-gray-100 min-h-screen`}>
        <Sidebar />
        <main className="flex-1 p-4 md:p-8 overflow-auto">
          {children}
        </main>
      </body>
    </html>
  )
}