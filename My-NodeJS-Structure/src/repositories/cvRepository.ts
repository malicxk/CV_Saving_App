import { ICvRepository } from '../providers/interfaces/ICvRepository';
import { pool } from '../providers/database';
import { FieldPacket, ResultSetHeader } from 'mysql2';

export class CvRepository implements ICvRepository {

  async createUser(data: {
    name: string;
    email: string;
    phone: string;
    professionalSummary: string;
    skills: string;
    workExperience: string;
    education: string;
  }): Promise<number> {
    const { name, email, phone, professionalSummary, skills, workExperience, education } = data;
    const [result]: any = await pool.execute(
      'INSERT INTO cvs (name, email, phone, professionalSummary, skills, workExperience, education) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [name, email, phone, professionalSummary, skills, workExperience, education]
    );
    return result.insertId;
  }


  async getAllUsers(): Promise<any[]> {
    const [rows]: any = await pool.execute('SELECT * FROM cvs');
    return rows;
  }

  async getUserById(id: number): Promise<any | null> {
    const [rows]: any = await pool.execute('SELECT * FROM cvs WHERE id = ?', [id]);
    return rows.length ? rows[0] : null;
  }

  async updateCv(id: number, data: any): Promise<any> {
    let updateFields: string[] = [];
    let values: any[] = [];

    for (const key in data) {
      if (data[key] !== undefined && data[key] !== null) {
        updateFields.push(`${key} = ?`);
        values.push(data[key]);
      }
    }

    if (updateFields.length === 0) {
      throw new Error('No valid fields to update');
    }

    values.push(id); // Add id to the end of the array

    const query = `UPDATE cvs SET ${updateFields.join(', ')} WHERE id = ?`;

    try {
      const [result, _]: [ResultSetHeader, FieldPacket[]] = await pool.execute(query, values); // destructure for result header
      console.log(result);

      if (result.affectedRows > 0) {
        return { success: true, id }
      } else {
        return null; // Return null if no rows were updated
      }
    } catch (error) {
      console.error('Error updating CV:', error);
      throw new Error('Database error');
    }
  }

  async deleteCv(id: number): Promise<boolean> {
    const [result]: any = await pool.execute('DELETE FROM cvs WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }



}
