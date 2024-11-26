import moment from "moment";
import dayjs from "dayjs";

export const formatDates = (
  dateString: string | Date | undefined | null
): string => {
  if (!dateString) return "";
  const date = new Date(dayjs(dateString).add(0, "hour").toDate());
  return moment(date).format("YYYY-MM-DD[T]HH:mm:ss");
};

export function formatDateNotTimeZone(
  date: Date | string | null | undefined
): string {
  if (date === null || date === undefined) {
    return "";
  }
  return moment(date).format("YYYY-MM-DD[T]HH:mm:ss");
}

export const formatDateTransfer = (
  dateString: string | Date | undefined | null,
  house: number = 7
): string => {
  if (!dateString) return "";
  const date = new Date(dayjs(dateString).add(house, "hour").toDate());
  if (date.getFullYear() < 2000) return "";
  return moment(date).format("DD-MM-YYYY HH:mm:ss");
};

export const formatDateTransferLastYear = (
  dateString: string | Date | undefined | null
): string => {
  if (!dateString) return "";
  const date = new Date(dayjs(dateString).add(0, "hour").toDate());
  if (date.getFullYear() < 2000) return "";
  return moment(date).format("DD-MM-YY HH:mm:ss");
};

export const formatDateTime = (
  dateString: string | Date | undefined | null
): string => {
  if (!dateString) return "";
  const date = new Date(dayjs(dateString).add(7, "hour").toDate());
  if (date.getFullYear() < 1900) return "";
  return moment(date).format("DD-MM-YYYY");
};

export const formatYear = (
  dateString: string | Date | undefined | null
): string => {
  if (!dateString) return "";
  const date = new Date(dayjs(dateString).add(0, "hour").toDate());
  if (date.getFullYear() < 1900) return "";
  return moment(date).format("YYYY");
};

export const handleKeyDownNumber = (event: any) => {
  if (event.key === "-" || event.code === "Space") {
    event.preventDefault();
  }
};

export const getValueById = (id: number | string, data: any, value: any) => {
  if (Array.isArray(data)) {
    const item = data.find(
      (d: any) => d.id === id || d.itemId === id || d.value === id
    );
    if (item) {
      return `${item[value]}`;
    }
  }
  return "";
};

export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const day = date.getDate();
  const month = date.getMonth() + 1; // Months are zero-based
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};
