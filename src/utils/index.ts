import dayjs from "dayjs";

export function formatDate(date: string | Date, year = true) {
  return year ? dayjs(date).format("MMM D, YYYY") : dayjs(date).format("MMM D");
}
