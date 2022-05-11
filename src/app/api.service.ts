import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class ApiService implements OnInit {
  private URL: string = environment.requestUrl;
  private userId: string = '';
  private userRole: string = '';
  constructor(private http: HttpClient) {}

  ngOnInit(): void {}

  private getIdFromStorage() {
    const userData: {
      id: string;
      role: string;
    } = JSON.parse(localStorage.getItem('userData')!);
    if (!userData) {
      return;
    }
    this.userId = userData.id;
    this.userRole = userData.role;
  }

  public get<T>(params: string = ''): Observable<T> {
    this.getIdFromStorage();
    return this.http.get<T>(`${this.URL}/api/v1/${params}`, {
      withCredentials: true,
      headers: { id: `${this.userId}`, role: `${this.userRole}` },
    });
  }

  public post<T>(params: string = '', body?: {}): Observable<T> {
    this.getIdFromStorage();
    return this.http.post<T>(`${this.URL}/api/v1/${params}`, body, {
      withCredentials: true,
      headers: { id: `${this.userId}`, role: `${this.userRole}` },
    });
  }

  public patch<T>(params: string = '', body?: {}): Observable<T> {
    this.getIdFromStorage();
    return this.http.patch<T>(`${this.URL}/api/v1/${params}`, body, {
      withCredentials: true,
      headers: { id: `${this.userId}`, role: `${this.userRole}` },
    });
  }

  public delete<T>(params: string = ''): Observable<T> {
    this.getIdFromStorage();
    return this.http.delete<T>(`${this.URL}/api/v1/${params}`, {
      withCredentials: true,
      headers: { id: `${this.userId}`, role: `${this.userRole}` },
    });
  }
}
