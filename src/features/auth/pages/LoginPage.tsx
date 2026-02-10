import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import type { LoginDto } from '../types';
import { toastError } from '@/shared/utils/toast';

export function LoginPage() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const from = (location.state as { from?: Location } | null)?.from?.pathname || '/dashboard';

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginDto>();

  const onSubmit = async (data: LoginDto) => {
    setIsLoading(true);
    setError(null);

    try {
      await signIn(data);
      navigate(from, { replace: true });
    } catch (err: unknown) {
      if (typeof err === 'object' && err !== null && 'status' in err && err.status === 401) {
        setError('Email ou senha inválidos');
      } else {
        setError('Erro ao fazer login. Tente novamente.');
      }

      toastError(err, 'Falha ao entrar. Verifique suas credenciais e tente novamente.', {
        id: 'auth:login:error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-slate-950'>
      <div className='max-w-md w-full space-y-8 p-8 bg-slate-900 rounded-lg border border-slate-700'>
        <div>
          <h2 className='mt-6 text-center text-3xl font-extrabold text-slate-100'>
            Entre na sua conta
          </h2>
        </div>
        <form className='mt-8 space-y-6' onSubmit={handleSubmit(onSubmit)}>
          {error && <div className='text-rose-500 text-sm text-center'>{error}</div>}
          <div className='rounded-md shadow-sm -space-y-px'>
            <div>
              <label htmlFor='email' className='sr-only'>
                Email
              </label>
              <input
                id='email'
                type='email'
                {...register('email', {
                  required: 'Email é obrigatório',
                  minLength: { value: 3, message: 'Email deve ter pelo menos 3 caracteres' },
                })}
                className='appearance-none rounded-none relative block w-full px-3 py-2 border border-slate-700 placeholder-slate-500 text-slate-100 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm bg-slate-800'
                placeholder='Email'
              />
              {errors.email && <p className='text-rose-500 text-xs mt-1'>{errors.email.message}</p>}
            </div>
            <div>
              <label htmlFor='password' className='sr-only'>
                Senha
              </label>
              <input
                id='password'
                type='password'
                {...register('password', {
                  required: 'Senha é obrigatória',
                  minLength: { value: 3, message: 'Senha deve ter pelo menos 3 caracteres' },
                })}
                className='appearance-none rounded-none relative block w-full px-3 py-2 border border-slate-700 placeholder-slate-500 text-slate-100 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm bg-slate-800'
                placeholder='Senha'
              />
              {errors.password && (
                <p className='text-rose-500 text-xs mt-1'>{errors.password.message}</p>
              )}
            </div>
          </div>

          <div>
            <button
              type='submit'
              disabled={isLoading}
              data-testid='login-submit'
              className='group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 focus:ring-offset-slate-950 disabled:opacity-50'
            >
              {isLoading ? 'Entrando...' : 'Entrar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
