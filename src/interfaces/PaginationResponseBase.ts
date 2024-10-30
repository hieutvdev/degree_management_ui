export interface PaginationResponseBase<T> {
  items?: T[];
  count?: number;
  pageIndex?: number;
  pageSize?: number;
}

export const paginationBase: object = {
  pageIndex: 0,
  pageSize: 50,
};
