export interface CreateDegreeManagementModel {
  stundentId: number | null;
  degreeTypeId: number | null;
  code: string | null;
  regNo: string | null;
  creditsRequired: number | null;
  status: number | null;
  description: string | null;
}

export interface UpdateDegreeManagementModel {
  id: number;
  stundentId: number | null;
  degreeTypeId: number | null;
  code: string | null;
  regNo: string | null;
  creditsRequired: number | null;
  status: number | null;
  description: string | null;
}

export interface ModelDegreeManagementQuery {
  id: number;
  stundentId: number | null;
  degreeTypeId: number | null;
  code: string | null;
  regNo: string | null;
  creditsRequired: number | null;
  status: number | null;
  description: string | null;
}
