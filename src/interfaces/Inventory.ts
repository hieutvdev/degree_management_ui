export interface CreateInventoryModel {
  degreeId: number | null;
  warehouseId: number | null;
  quantity: number | null;
  issueDate: string | null;
  status: boolean;
  description: string | null;
}

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
