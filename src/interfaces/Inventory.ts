export interface ModelInventoryQuery {
  id: number;
  degreeId: number | null;
  warehouseId: number | null;
  quantity: number | null;
  issueDate: string | null;
  status: boolean;
  description: string | null;
}

export interface UpdateInventoryModel {
  id: number;
  degreeId: number | null;
  warehouseId: number | null;
  quantity: number | null;
  issueDate: string | null;
  status: boolean;
  description: string | null;
}

export interface StockInInventoryModel {
  warehouseId: number | null;
  degreeTypeId: number | null;
  quantity: number | null;
  description: string | null;
}
