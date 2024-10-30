export interface StudentGraduatedModelQuery {
  fullName: string | null;
  dateOfBirth: string | null;
  gender: boolean | null;
  graduationYear: string | null;
  majorId: number;
  gpa: number | null;
  honors: number | null;
  contactEmail: string | null;
  phoneNumber: string | null;
}
