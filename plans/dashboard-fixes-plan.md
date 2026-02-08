# Implementation Plan: Dashboard Period Filter Fixes

## Overview

This plan addresses two issues:

1. Make the dashboard period filter sticky while scrolling
2. Fix the period filter in the deliveries table (quick filters not working)

---

## Issue 1: Make DashboardPeriodFilter Sticky

### File: [`src/features/dashboard/pages/DashboardPage.tsx`](src/features/dashboard/pages/DashboardPage.tsx:74)

**Current Code (line 74):**

```tsx
<div className='shrink-0'>
```

**Proposed Change:**

```tsx
<div className='sticky top-0 z-20 bg-slate-900 shrink-0'>
```

**Rationale:**

- `sticky` - enables sticky positioning
- `top-0` - sticks to the top of the viewport
- `z-20` - ensures it stays above other content during scroll
- `bg-slate-900` - provides background color to prevent content from showing through

---

## Issue 2: Fix Quick Filter Date Range Conversion

### Problem Analysis

The [`DeliveryDateFilter`](src/features/deliveries/components/DeliveryDateFilter.tsx) component correctly sets `quickFilter` when selecting predefined periods, but [`DeliveriesFilterBar`](src/features/deliveries/components/DeliveriesFilterBar.tsx:66) only extracts `dateFrom` and `dateTo`, ignoring `quickFilter`.

According to the docs in [`FLOWS.md`](docs/kilo/FLOWS.md:73):

> "Quick filters são convertidos para dateFrom/dateTo no frontend antes da chamada"

### File: [`src/features/deliveries/components/DeliveriesFilterBar.tsx`](src/features/deliveries/components/DeliveriesFilterBar.tsx)

#### Change 1: Add helper function to convert quick filters to date ranges

```typescript
/**
 * Convert quick filter to date range (YYYY-MM-DD format)
 */
function quickFilterToDateRange(
  quickFilter: 'today' | 'tomorrow' | 'thisWeek' | null
): { dateFrom: string; dateTo: string } | null {
  if (!quickFilter) return null;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const thisWeekStart = new Date(today);
  thisWeekStart.setDate(today.getDate() - today.getDay()); // Monday

  const thisWeekEnd = new Date(today);
  thisWeekEnd.setDate(today.getDate() + (6 - today.getDay())); // Sunday

  const formatDate = (d: Date) => d.toISOString().split('T')[0];

  switch (quickFilter) {
    case 'today':
      return { dateFrom: formatDate(today), dateTo: formatDate(today) };
    case 'tomorrow':
      return { dateFrom: formatDate(tomorrow), dateTo: formatDate(tomorrow) };
    case 'thisWeek':
      return { dateFrom: formatDate(thisWeekStart), dateTo: formatDate(thisWeekEnd) };
    default:
      return null;
  }
}
```

#### Change 2: Update `handleDateFilterChange` to convert quick filters

**Current Code (lines 66-74):**

```typescript
const handleDateFilterChange = (value: DeliveryDateFilterValue) => {
  setDateFilter(value);
  onFiltersChange({
    ...filters,
    dateFrom: value.dateFrom || undefined,
    dateTo: value.dateTo || undefined,
    page: 1,
  });
};
```

**Proposed Change:**

```typescript
const handleDateFilterChange = (value: DeliveryDateFilterValue) => {
  setDateFilter(value);

  // Convert quick filter to date range
  const dateRange = quickFilterToDateRange(value.quickFilter);

  onFiltersChange({
    ...filters,
    dateFrom: dateRange?.dateFrom || value.dateFrom || undefined,
    dateTo: dateRange?.dateTo || value.dateTo || undefined,
    page: 1,
  });
};
```

---

## Test Updates Required

### File: [`src/__tests__/features/deliveries/components/DeliveriesFilterBar.test.tsx`](src/__tests__/features/deliveries/components/DeliveriesFilterBar.test.tsx)

Tests at lines 52-101 expect `dateFrom: undefined` and `dateTo: undefined` for quick filters. These tests need to be updated to expect actual date ranges based on the current date.

---

## Execution Order

1. Make DashboardPeriodFilter sticky in DashboardPage.tsx
2. Add `quickFilterToDateRange` helper function in DeliveriesFilterBar.tsx
3. Update `handleDateFilterChange` to use the helper
4. Run tests to identify which tests fail
5. Update tests to match new expected behavior
6. Run all tests to verify fixes
