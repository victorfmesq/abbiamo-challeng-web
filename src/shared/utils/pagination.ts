/**
 * Calculate the start and end item numbers for pagination display.
 * @param page - Current page number (1-indexed)
 * @param limit - Number of items per page
 * @param total - Total number of items
 * @returns Object with startItem and endItem numbers
 */
export function calculatePaginationRange(
  page: number,
  limit: number,
  total: number
): {
  startItem: number;
  endItem: number;
} {
  const startItem = Math.max(1, (page - 1) * limit + 1);
  const endItem = Math.min(page * limit, total);
  return { startItem, endItem };
}

/**
 * Calculate the total number of pages.
 * @param total - Total number of items
 * @param limit - Number of items per page
 * @returns Total number of pages
 */
export function calculateTotalPages(total: number, limit: number): number {
  if (total === 0) return 0;
  return Math.ceil(total / limit);
}

/**
 * Generate the display text for pagination range.
 * @param page - Current page number (1-indexed)
 * @param limit - Number of items per page
 * @param total - Total number of items
 * @returns Formatted string like "A–B de T"
 */
export function formatPaginationRange(page: number, limit: number, total: number): string {
  const { startItem, endItem } = calculatePaginationRange(page, limit, total);
  return `${startItem}–${endItem} de ${total}`;
}

/**
 * Generate the full pagination info text.
 * @param page - Current page number (1-indexed)
 * @param totalPages - Total number of pages
 * @param limit - Number of items per page
 * @param total - Total number of items
 * @returns Formatted string like "Página X de Y (A–B de T)"
 */
export function formatPaginationInfo(
  page: number,
  totalPages: number,
  limit: number,
  total: number
): string {
  const range = formatPaginationRange(page, limit, total);
  return `Página ${page} de ${totalPages} (${range})`;
}

/**
 * Validate and normalize page number.
 * @param page - Requested page number
 * @param totalPages - Total number of pages
 * @returns Normalized page number (1 to totalPages)
 */
export function normalizePage(page: number, totalPages: number): number {
  if (totalPages === 0) return 1;
  return Math.max(1, Math.min(page, totalPages));
}

/**
 * Check if a page change is valid.
 * @param currentPage - Current page number
 * @param newPage - Proposed new page number
 * @param totalPages - Total number of pages
 * @returns True if the page change is valid
 */
export function isValidPageChange(
  currentPage: number,
  newPage: number,
  totalPages: number
): boolean {
  if (newPage < 1 || newPage > totalPages) return false;
  return newPage !== currentPage;
}
