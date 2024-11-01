export interface CreateWareHouseModel {
  name: string | null;
  code: string | null;
  active: boolean;
  description: string | null;
}

export interface UpdateWareHouseModel {
  id: number;
  name: string | null;
  code: string | null;
  active: boolean;
  description: string | null;
}

export interface ModelWareHouseQuery {
  id: number;
  code: string | null;
  name: string | null;
  active: boolean;
  description: string | null;
}
