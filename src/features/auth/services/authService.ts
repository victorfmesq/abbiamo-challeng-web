import type { LoginDto, LoginResponseDto } from '../types';
import api from '@/services/httpClient';

export async function login(dto: LoginDto) {
  return api.request<LoginResponseDto>('/auth/login', { method: 'POST', body: dto, auth: false });
}
