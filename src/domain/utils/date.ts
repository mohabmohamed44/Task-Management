import { format, parseISO, isValid } from 'date-fns';

  export function formatDate(date: Date | string | null | undefined) {
    if (!date) return 'N/A';
    try {
      let dateObj: Date;
      
      if (typeof date === 'string') {
        dateObj = parseISO(date);
      } else if (date instanceof Date) {
        dateObj = date;
      } else {
        return 'N/A';
      }
      
      if (!isValid(dateObj)) {
        return 'N/A';
      }
      
      return format(dateObj, 'MMMM d, yyyy');
    } catch {
      return 'N/A';
    }
  }
