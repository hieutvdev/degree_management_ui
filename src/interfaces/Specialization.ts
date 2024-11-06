export interface ModelSpecializationQuery {
  id: number;
  name: string | null;
  code: string | null;
  active: boolean;
  description: string | null;
  majorId: number | null;
}

export interface CreateSpecializationModel {
  name: string | null;
  code: string | null;
  active: boolean;
  description: string | null;
  majorId: number | null;
}

export interface UpdateSpecializationModel {
  id: number;
  name: string | null;
  code: string | null;
  active: boolean;
  description: string | null;
  majorId: number | null;
}
