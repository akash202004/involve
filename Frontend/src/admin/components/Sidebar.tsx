'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { FiHome, FiUsers, FiTool, FiDollarSign, FiMap, FiPieChart } from 'react-icons/fi'

const navItems = [
  { name: 'Dashboard', href: '/admin', icon: <FiHome /> },
  { name: 'Users', href: '/admin/users', icon: <FiUsers /> },
  { name: 'Workers', href: '/admin/workers', icon: <FiTool /> },
  { name: 'Jobs', href: '/admin/jobs', icon: <FiTool /> },
  { name: 'Transactions', href: '/admin/transactions', icon: <FiDollarSign /> },
  { name: 'Analytics', href: '/admin/analytics', icon: <FiPieChart /> },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="w-64 bg-white shadow-md h-screen fixed">
      <div className="p-4 border-b">
        <h1 className="text-xl font-bold text-gray-800">ServicePro Admin</h1>
      </div>
      <nav className="p-4">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.name}>
              <Link
                href={item.href}
                className={`flex items-center p-3 rounded-lg ${pathname === item.href ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-100'}`}
              >
                <span className="mr-3">{item.icon}</span>
                <span>{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  )
}