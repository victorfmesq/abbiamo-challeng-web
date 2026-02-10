import { Routes, Route, Navigate } from 'react-router-dom';
import { RequireAuth } from './RequireAuth';
import { LoginPage } from '@/features/auth/pages/LoginPage';
import { AppShell } from '@/app/layouts/AppShell';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { DeliveriesListPage } from '@/features/deliveries/pages/DeliveriesListPage';
import { DashboardPage } from '@/features/dashboard/pages';

function DeliveryDetailPage() {
  return (
    <div className='p-8'>
      <h1 className='text-2xl font-bold text-gray-900'>Detalhe da Entrega</h1>
      <p className='text-gray-600 mt-2'>Informações detalhadas da entrega.</p>
    </div>
  );
}

export function CatchAllRoute() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to='/login' replace />;
  }

  return <Navigate to='/dashboard' replace />;
}

export function AppRouter() {
  return (
    <Routes>
      <Route path='/login' element={<LoginPage />} />

      <Route
        path='/'
        element={
          <RequireAuth>
            <AppShell />
          </RequireAuth>
        }
      >
        <Route index element={<Navigate to='/dashboard' replace />} />
        <Route path='dashboard' element={<DashboardPage />} />
        <Route path='deliveries' element={<DeliveriesListPage />} />
        <Route path='deliveries/:id' element={<DeliveryDetailPage />} />
      </Route>

      <Route path='*' element={<CatchAllRoute />} />
    </Routes>
  );
}
