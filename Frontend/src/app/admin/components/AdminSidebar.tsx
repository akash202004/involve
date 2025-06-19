import Link from 'next/link';
import {
  ChartBarIcon,
  UsersIcon,
  WrenchScrewdriverIcon,
  ClipboardDocumentListIcon,
  ChatBubbleLeftRightIcon,
} from '@heroicons/react/24/outline';

interface AdminSidebarProps {
  currentSection: string;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ currentSection }) => {
  const navItems = [
    { name: 'Overview', section: 'overview', icon: ChartBarIcon },
    { name: 'Users', section: 'users', icon: UsersIcon },
    { name: 'Workers', section: 'workers', icon: WrenchScrewdriverIcon },
    { name: 'Services', section: 'services', icon: ClipboardDocumentListIcon },
    { name: 'Reviews', section: 'reviews', icon: ChatBubbleLeftRightIcon },
  ];

  return (
    <div className="w-64 bg-indigo-700 text-white h-full fixed">
      <div className="p-4 border-b border-indigo-600">
        <h1 className="text-xl font-bold">Admin Dashboard</h1>
      </div>
      <nav className="p-4 space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.name}
            href={`/admin?section=${item.section}`}
            className={`flex items-center px-4 py-2 rounded-lg ${
              currentSection === item.section ? 'bg-indigo-800' : 'hover:bg-indigo-600'
            }`}
          >
            <item.icon className="h-5 w-5 mr-3" />
            {item.name}
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default AdminSidebar;