export interface CreatePeriodModel {
  name: string | null;
  startDate: string | null;
  endDate: string | null;
  active: boolean;
  description: string | null;
  yearGraduationId: number | null;
}

export interface ModelPeriodQuery {
  id: number;
  name: string | null;
  startDate: string | null;
  endDate: string | null;
  active: boolean;
  description: string | null;
  yearGraduationId: number | null;
}

export interface UpdatePeriodModel {
  id: number;
  name: string | null;
  startDate: string | null;
  endDate: string | null;
  active: boolean;
  description: string | null;
  yearGraduationId: number | null;
}
