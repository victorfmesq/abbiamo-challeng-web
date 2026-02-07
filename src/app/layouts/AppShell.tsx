import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/features/auth/hooks/useAuth';

export function AppShell() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    signOut();
    navigate('/login');
  };

  return (
    <div className='min-h-screen bg-slate-950'>
      <header className='bg-slate-900 border-b border-slate-700'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex justify-between h-16'>
            <div className='flex'>
              <div className='flex-shrink-0 flex items-center'>
                <h1 className='text-xl font-bold text-indigo-500'>Delivery Monitor</h1>
              </div>
              <nav className='ml-8 flex space-x-4'>
                <Link
                  to='/dashboard'
                  className='px-3 py-2 rounded-md text-sm font-medium text-slate-300 hover:text-slate-100 hover:bg-slate-800'
                >
                  Dashboard
                </Link>
                <Link
                  to='/deliveries'
                  className='px-3 py-2 rounded-md text-sm font-medium text-slate-300 hover:text-slate-100 hover:bg-slate-800'
                >
                  Entregas
                </Link>
              </nav>
            </div>
            <div className='flex items-center space-x-4'>
              <span className='text-sm text-slate-400'>
                Olá, <span className='font-medium text-slate-200'>{user?.name || 'Usuário'}</span>
              </span>
              <button
                onClick={handleLogout}
                className='px-3 py-2 rounded-md text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-500'
              >
                Sair
              </button>
            </div>
          </div>
        </div>
      </header>
      <main className='max-w-7xl mx-auto py-6 sm:px-6 lg:px-8'>
        <Outlet />
      </main>
    </div>
  );
}
