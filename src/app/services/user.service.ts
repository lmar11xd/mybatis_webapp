import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environments';
import { Observable } from 'rxjs';
import { User } from '../interfaces/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private endPoint:string = environment.endPoint;
  private apiUrl:string = this.endPoint + "/users";

  constructor(private http:HttpClient) { }

  getList(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}`);
  }

  getById(id:number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`);
  }

  add(user:User): Observable<User> {
    return this.http.post<User>(this.apiUrl, user);
  }

  update(id:number, user:User): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${id}`, user);
  }

  delete(id:number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
