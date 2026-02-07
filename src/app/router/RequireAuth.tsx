import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/features/auth/hooks/useAuth';

type RequireAuthProps = {
  children: React.ReactNode;
};

export function RequireAuth({ children }: RequireAuthProps) {
  const { status, isAuthenticated } = useAuth();
  const location = useLocation();

  if (status === 'checking') {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='text-gray-500'>Carregando...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to='/login' state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
