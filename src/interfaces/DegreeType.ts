export interface DegreeTypeModelQuery {
  id: number;
  code: string | null;
  name: string | null;
  active: boolean | null;
  duration: number | null;
  descripion: string | null;
  level: number | null;
}

export interface CreateDegreeTypeModel {
  code: string | null;
  name: string | null;
  active: boolean;
  duration: number | null;
  level: number | null;
  specializationId: number | null;
  description: string | null;
}
