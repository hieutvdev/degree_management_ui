export interface PaginationResponseBase<T> {
  items?: T[];
  count?: number;
  pageIndex?: number;
  pageSize?: number;
}

export const paginationBase: any = {
  pageIndex: 0,
  pageSize: 50,
};
