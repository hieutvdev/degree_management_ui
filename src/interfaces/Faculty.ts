export interface FacultyModelQuery {
  id: number;
  name: string | null;
  code: string | null;
  active: boolean;
  description: string | null;
}

export interface CreateFacultyModel {
  name: string | null;
  code: string | null;
  active: boolean;
  description: string | null;
}
