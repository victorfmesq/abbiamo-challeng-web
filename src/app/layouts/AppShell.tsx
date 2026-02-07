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
    <div className='h-screen flex flex-col bg-slate-950 overflow-hidden'>
      <header className='shrink-0 bg-slate-900 border-b border-slate-700'>
        <div className='w-full mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex justify-between h-16'>
            <div className='flex'>
              <div className='shrink-0 flex items-center'>
                <h1 className='text-xl font-bold text-indigo-500'>Delivery Monitor</h1>
              </div>
              <nav className='ml-8 flex space-x-4 items-center'>
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
      <main className='flex-1 min-h-0 overflow-hidden'>
        <div className='h-full min-h-0 w-full px-4 py-6 sm:px-6 lg:px-8 flex flex-col'>
          <Outlet />
        </div>
      </main>
    </div>
  );
}
