export const formatCurrency = (amount: number, currency = 'NT$') => {
  return `${currency} ${amount.toLocaleString()}`;
};

export const formatDate = (date: string | Date | undefined, locale = 'zh-TW') => {
  if (!date) return '---';
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString(locale, {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
};

export const formatTime = (date: string | Date | undefined, locale = 'zh-TW') => {
  if (!date) return '---';
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleTimeString(locale, {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
};
