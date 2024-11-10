export interface StockInInvSuggestDetail {
  id: number | null;
  stockInInvSuggestId: number | null;
  degreeTypeId: number | null;
  quantity: number | null;
}

export interface CreateInwardModel {
  warehouseId: number | null;
  requestPersonId: number | null;
  code: string | null;
  stockInInvSuggestDetails: StockInInvSuggestDetail[] | null;
  status: number | null;
  note: string | null;
}
