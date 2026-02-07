import { describe, it, expect } from 'vitest';
import {
  normalizeDeliveriesFilters,
  toDeliveriesQueryParams,
} from '@/features/deliveries/domain/deliveriesFilters';

describe('deliveriesFilters', () => {
  it('normaliza page/limit e remove search vazia', () => {
    const out = normalizeDeliveriesFilters({ page: 0, limit: -1, search: '   ' });
    expect(out.page).toBe(1);
    expect(out.limit).toBe(10);
    expect(out.search).toBeUndefined();
  });

  it("converte status 'all' para undefined", () => {
    const out = normalizeDeliveriesFilters({ status: 'all' });
    expect(out.status).toBeUndefined();
  });

  it('gera query params mínimos', () => {
    const params = toDeliveriesQueryParams({});
    expect(params.page).toBe(1);
    expect(params.limit).toBe(10);
  });
});
