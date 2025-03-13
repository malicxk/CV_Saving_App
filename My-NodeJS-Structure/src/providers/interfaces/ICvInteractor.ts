export interface ICvInteractor {
  saveCv(data: {
    name: string; email: string; phone: string;
    professionalSummary: string | null; skills: string | null;
    workExperience: string | null; education: string | null;
  }):Promise<number>;
  getAllCvs(): Promise<any[]>;
  getCvById(id: number): Promise<any | null>;
  updateCv(id: number, data: any): Promise<boolean>;
  deleteCv(id: number): Promise<boolean>;
}
