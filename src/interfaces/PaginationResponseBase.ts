import { MRT_PaginationState } from "mantine-react-table";

export interface PaginationResponseBase<T> {
  data: T[];
  count: number;
  pageIndex: number;
  pageSize: number;
}

export const paginationBase: MRT_PaginationState = {
  pageIndex: 0,
  pageSize: 50,
};
