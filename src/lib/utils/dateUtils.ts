import customParseFormat from 'dayjs/plugin/customParseFormat';
import dayjs from 'dayjs';

dayjs.extend(customParseFormat);

export function strToDate(dateString: string, format?: string): Date {
  if (!dateString) throw new Error('date cannot be null');
  return dayjs(dateString, format ?? 'DD-MM-YYYY').toDate();
}
