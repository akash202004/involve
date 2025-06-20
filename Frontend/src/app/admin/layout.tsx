'use client'
import AdminSidebar from './components/AdminSidebar';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen">
      {/* Fixed sidebar */}
      <div className="w-64 fixed h-full bg-indigo-700 text-white z-10">
        <AdminSidebar />
      </div>
      
      {/* Main content */}
      <div className="flex-1 ml-64 p-6">
        {children}
      </div>
    </div>
  );
}