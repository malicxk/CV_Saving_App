import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})


export class CvService {

  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) { }

  // Save CV data
  saveCv(cvData: any): Observable<any> {
    console.log("Entered in to the service", cvData);
    cvData.dateAdded = new Date().toISOString();
    console.log("Entered into the service", cvData)
    return this.http.post(`${this.apiUrl}/userCv/save`, cvData);
  }

  // Get all saved CVs
  getAllCvs(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/userCv/all`);
  }

  // Get CV by ID
  getCvById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/userCv/${id}`);
  }

  updateCv(id: number, cvData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/userCv/${id}`, cvData);
  }


  // Delete a CV
  deleteCv(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/userCv/${id}`);
  }

  //For generation pdf files
  generateCvPdf(id: number) {
    console.log("the id is", id)
    return this.http.get(`${this.apiUrl}/userCv/${id}/generate-pdf`, { responseType: 'blob' });
  }



}
