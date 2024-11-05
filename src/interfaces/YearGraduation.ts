export interface ModelYearGraduationQuery {
  id: number;
  name: string | null;
  active: boolean;
  description: string | null;
}

export interface CreateYearGraduationModel {
  name: string | null;
  active: boolean;
  description: string | null;
}

export interface UpdateYearGraduationModel {
  id: number;
  name: string | null;
  active: boolean;
  description: string | null;
}
