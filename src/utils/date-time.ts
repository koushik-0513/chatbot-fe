export const parseToDate = (
  input: string | number | Date | undefined | null
) => {
  if (!input) return null;
  const d = input instanceof Date ? input : new Date(input);
  return isNaN(d.getTime()) ? null : d;
};

export const isToday = (d: Date) => {
  const now = new Date();
  return (
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate()
  );
};

export const isYesterday = (d: Date) => {
  const y = new Date();
  y.setDate(y.getDate() - 1);
  return (
    d.getFullYear() === y.getFullYear() &&
    d.getMonth() === y.getMonth() &&
    d.getDate() === y.getDate()
  );
};

export const formatChatTime = (
  input: string | number | Date | undefined | null
) => {
  const d = parseToDate(input);
  if (!d) return "";
  return new Intl.DateTimeFormat(undefined, {
    hour: "numeric",
    minute: "2-digit",
  }).format(d);
};

export const formatDayOrDate = (
  input: string | number | Date | undefined | null
) => {
  const d = parseToDate(input);
  if (!d) return "";
  if (isToday(d)) return "Today";
  if (isYesterday(d)) return "Yesterday";
  return new Intl.DateTimeFormat(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
  }).format(d);
};
