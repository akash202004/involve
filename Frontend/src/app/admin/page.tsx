import AdminSidebar from './components/AdminSidebar';
import OverviewPage from './pages/overview';
import UsersPage from './pages/users';
import WorkersPage from './pages/workers';
import ServicesPage from './pages/services';
import ReviewsPage from './pages/reviews';

interface AdminPageProps {
  searchParams: {
    section?: string;
  };
}

export default function AdminPage({ searchParams }: AdminPageProps) {
  // Determine which section to show based on URL params
  const currentSection = searchParams.section || 'overview';

  const renderSection = () => {
    switch (currentSection) {
      case 'users':
        return <UsersPage />;
      case 'workers':
        return <WorkersPage />;
      case 'services':
        return <ServicesPage />;
      case 'reviews':
        return <ReviewsPage />;
      case 'overview':
      default:
        return <OverviewPage />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Admin Sidebar */}
      <AdminSidebar currentSection={currentSection} />

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <main className="p-6">
          {renderSection()}
        </main>
      </div>
    </div>
  );
}