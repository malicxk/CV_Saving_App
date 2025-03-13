export interface ICvRepository {
  createUser(data: { name: string; email: string; phone: string}): Promise<number>;
  getAllUsers(): Promise<any[]>;
  getUserById(id: number): Promise<any | null>;
  updateCv(id: number, data: any): Promise<boolean>;
  deleteCv(id: number): Promise<boolean>;
}
