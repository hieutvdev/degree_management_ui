export interface CreateDegreeManagementModel {
  stundentId: number | null;
  degreeTypeId: number | null;
  code: string | null;
  regNo: string | null;
  status: number | null;
  description: string | null;
}

export interface UpdateDegreeManagementModel {
  id: number;
  stundentId: number | null;
  degreeTypeId: number | null;
  code: string | null;
  regNo: string | null;
  status: number | null;
  description: string | null;
}

export interface ModelDegreeManagementQuery {
  id: number;
  stundentId: number | null;
  degreeTypeId: number | null;
  code: string | null;
  regNo: string | null;
  status: number | null;
  description: string | null;
}

export interface IssueIdentificationModel {
  studentIds: number[] | null;
  warehouseId: number | null;
  decisionNumber: string | null;
  prefixCode: string | null;
  startCodeNum: number | null;
  codeLength: number | null;
  suffixCode: string | null;
  prefixRegNo: string | null;
  startRegNoNum: number | null;
  regNoLength: number | null;
  suffixRegNo: string | null;
}
