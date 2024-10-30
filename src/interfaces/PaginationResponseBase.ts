export interface PaginationResponseBase<T> {
  items?: T[];
  count?: number;
  pageIndex?: number;
  pageSize?: number;
}
