export default function WorkerDashboardPage() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      fontFamily: 'sans-serif',
      background: '#f4f6f8'
    }}>
      <h1 style={{ fontSize: '2.5rem', color: '#1c1c1e' }}>Welcome to your Dashboard</h1>
      <p style={{ fontSize: '1.2rem', color: '#6c757d' }}>Your jobs and earnings will be displayed here.</p>
    </div>
  );
}