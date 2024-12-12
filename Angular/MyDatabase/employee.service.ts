import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Employee } from '../models/employee';
import { Qualification } from '../models/qualification';
import { Observable } from 'rxjs';
import { ImageUploadResponse } from '../models/image-upload-response';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  constructor(private http:HttpClient) { }
  getAll(): Observable<Employee[]>{
    return this.http.get<Employee[]>(`http://localhost:5129/api/Employees`);
  }
  getQualifications(id:number): Observable<Qualification[]>{
    return this.http.get<Qualification[]>(`http://localhost:5129/api/Employees/Qualification/Of/${id}`);
  }
  getById(id:number):Observable<Employee>{
    return this.http.get<Employee>(`http://localhost:5129/api/Employees/${id}`);
  }
  save(data:Employee):Observable<Employee>{
    return this.http.post<Employee>(`http://localhost:5129/api/Employees`, data);
  }
  update(data:Employee):Observable<any>{
    return this.http.put<any>(`http://localhost:5129/api/Employees/${data.employeeId}`, data);
  }
  delete(id:number):Observable<any>{
    return this.http.delete<any>(`http://localhost:5129/api/Employees/${id}`);
  }
  uploadImage(f: File): Observable<ImageUploadResponse> {
    const formData = new FormData();

    formData.append('pic', f);
    return this.http.post<ImageUploadResponse>(`http://localhost:5129/api/Employees/Image/Upload`, formData);
  }
}

