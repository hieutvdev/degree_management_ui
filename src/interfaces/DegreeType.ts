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
  level: number | null;
  description: string | null;
}
