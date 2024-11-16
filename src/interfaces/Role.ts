export interface CreateRoleModel {
  name: string | null;
  description: string | null;
  status: number | null;
}

export interface UpdateRoleModel {
  id: number;
  name: string | null;
  description: string | null;
  status: number | null;
}
