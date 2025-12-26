import dayjs from "dayjs";

export function isPastDate(dateStr) {
  const today = dayjs().format("YYYY-MM-DD");
  return dateStr < today;
}
