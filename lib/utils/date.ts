import { format, parseISO, isValid } from 'date-fns';
import { fr } from 'date-fns/locale';

/**
 * Format a date to a readable string in French
 */
export function formatDate(
  date: Date | string | undefined | null,
  formatStr: string = 'PPP'
): string {
  if (!date) return '';

  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    if (!isValid(dateObj)) return '';
    return format(dateObj, formatStr, { locale: fr });
  } catch (error) {
    console.error('Error formatting date:', error);
    return '';
  }
}

/**
 * Format a date with time in French
 */
export function formatDateTime(
  date: Date | string | undefined | null
): string {
  return formatDate(date, 'PPP à HH:mm');
}

/**
 * Format a time range
 */
export function formatTimeRange(
  startDate: Date | string | undefined | null,
  endDate: Date | string | undefined | null
): string {
  if (!startDate || !endDate) return '';

  try {
    const start =
      typeof startDate === 'string' ? parseISO(startDate) : startDate;
    const end = typeof endDate === 'string' ? parseISO(endDate) : endDate;

    if (!isValid(start) || !isValid(end)) return '';

    const startTime = format(start, 'HH:mm', { locale: fr });
    const endTime = format(end, 'HH:mm', { locale: fr });

    return `${startTime} - ${endTime}`;
  } catch (error) {
    console.error('Error formatting time range:', error);
    return '';
  }
}

/**
 * Check if two date ranges overlap
 */
export function doDateRangesOverlap(
  start1: Date,
  end1: Date,
  start2: Date,
  end2: Date
): boolean {
  return start1 < end2 && start2 < end1;
}

