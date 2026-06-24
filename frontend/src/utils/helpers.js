import { format, isPast, isToday, isTomorrow, parseISO } from 'date-fns';

/**
 * Format a date for display
 */
export const formatDate = (date) => {
  if (!date) return null;
  const d = typeof date === 'string' ? parseISO(date) : date;
  return format(d, 'MMM d, yyyy');
};

/**
 * Format a date for form input (YYYY-MM-DD)
 */
export const formatDateForInput = (date) => {
  if (!date) return '';
  const d = typeof date === 'string' ? parseISO(date) : date;
  return format(d, 'yyyy-MM-dd');
};

/**
 * Get a human-readable relative date label
 */
export const getDateLabel = (date) => {
  if (!date) return null;
  const d = typeof date === 'string' ? parseISO(date) : date;
  if (isToday(d)) return 'Today';
  if (isTomorrow(d)) return 'Tomorrow';
  return format(d, 'MMM d');
};

/**
 * Check if a date is overdue (past and not completed)
 */
export const isOverdue = (date, completed) => {
  if (!date || completed) return false;
  const d = typeof date === 'string' ? parseISO(date) : date;
  return isPast(d) && !isToday(d);
};

/**
 * Get priority configuration
 */
export const getPriorityConfig = (priority) => {
  const configs = {
    high: { label: 'High', color: 'var(--priority-high)', className: 'high' },
    medium: { label: 'Medium', color: 'var(--priority-medium)', className: 'medium' },
    low: { label: 'Low', color: 'var(--priority-low)', className: 'low' },
  };
  return configs[priority] || configs.medium;
};

/**
 * Get user initials from name
 */
export const getInitials = (name) => {
  if (!name) return '?';
  return name
    .split(' ')
    .map((word) => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};
