import dayjs from "dayjs";

export const isExternal = (path: string) => {
  const outboundRE = /^(https?:|mailto:|tel:)/;
  return outboundRE.test(path);
};

export function formatDate(date: string | Date, year: boolean = true) {
  return year ? dayjs(date).format("MMM D, YYYY") : dayjs(date).format("MMM D");
}

export const isClient = typeof window !== "undefined";
