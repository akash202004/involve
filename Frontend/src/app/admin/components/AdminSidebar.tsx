'use client'
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ChartBarIcon,
  UsersIcon,
  WrenchScrewdriverIcon,
  ClipboardDocumentListIcon,
  ChatBubbleLeftRightIcon,
} from '@heroicons/react/24/outline';

export default function AdminSidebar() {
  const pathname = usePathname();

  const navItems = [
    { name: 'Overview', href: '/admin/dashboard', icon: ChartBarIcon },
    { name: 'Users', href: '/admin/users', icon: UsersIcon },
    { name: 'Workers', href: '/admin/workers', icon: WrenchScrewdriverIcon },
    { name: 'Services', href: '/admin/services', icon: ClipboardDocumentListIcon },
    { name: 'Reviews', href: '/admin/reviews', icon: ChatBubbleLeftRightIcon },
  ];

  return (
    <div className="h-full flex flex-col bg-white border-r border-gray-100 shadow-sm">
      {/* Minimalist header */}
      <div className="p-6 pb-4">
        <h1 className="text-xl font-semibold text-gray-800">
          Admin<span className="text-indigo-600">.</span>
        </h1>
      </div>
      
      {/* Clean navigation items */}
      <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={`flex items-center px-3 py-2.5 rounded-lg transition-all duration-200 ${
              pathname === item.href
                ? 'bg-indigo-50 text-indigo-600 font-medium'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            <item.icon className={`h-5 w-5 mr-3 ${
              pathname === item.href ? 'text-indigo-500' : 'text-gray-400'
            }`} />
            <span>{item.name}</span>
            {pathname === item.href && (
              <span className="ml-auto h-1.5 w-1.5 rounded-full bg-indigo-500"></span>
            )}
          </Link>
        ))}
      </nav>
      
      {/* Subtle footer */}
      <div className="p-4 border-t border-gray-100">
        <div className="flex items-center justify-center">
          <div className="flex items-center">
            <span className="text-xs text-gray-500 font-medium px-2 py-1 rounded bg-gray-50">
              DEMO MODE
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}