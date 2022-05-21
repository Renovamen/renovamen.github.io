import dayjs from "dayjs";

export const isExternal = (path: string) => {
  const outboundRE = /^(https?:|mailto:|tel:)/;
  return outboundRE.test(path);
};

export function formatDate(date: string | Date) {
  return dayjs(date).format("MMM D, YYYY");
}

export const isClient = typeof window !== "undefined";
