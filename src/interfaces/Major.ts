export interface MajorModelQuery {
  id: number;
  name: string | null;
  code: string | null;
  active: boolean | null;
  description: string | null;
  facultyId: number;
  facultyName?: string;
}

export interface CreateMajorModel {
  name: string | null;
  code: string | null;
  active: boolean;
  description: string | null;
  facultyId: number;
}

export interface UpdateMajorModel {
  id: number;
  name: string | null;
  code: string | null;
  active: boolean | null;
  description: string | null;
  facultyId: number;
}
