import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class ApiService implements OnInit {
  private URL: string = environment.requestUrl;
  private headers!: { token: string; id: string; role: string };
  constructor(private http: HttpClient) {}

  ngOnInit(): void {}

  private getIdFromStorage() {
    const userData: {
      id: string;
      role: string;
      token: string;
    } = JSON.parse(localStorage.getItem('userData')!);
    if (!userData) {
      return;
    }

    this.headers = {
      token: userData.token,
      id: userData.id,
      role: userData.role,
    };
  }

  public get<T>(params: string = ''): Observable<T> {
    this.getIdFromStorage();
    return this.http.get<T>(`${this.URL}/api/v1/${params}`, {
      withCredentials: true,
      headers: this.headers,
    });
  }

  public post<T>(params: string = '', body?: {}): Observable<T> {
    this.getIdFromStorage();
    return this.http.post<T>(`${this.URL}/api/v1/${params}`, body, {
      withCredentials: true,
      headers: this.headers,
    });
  }

  public patch<T>(params: string = '', body?: {}): Observable<T> {
    this.getIdFromStorage();
    return this.http.patch<T>(`${this.URL}/api/v1/${params}`, body, {
      withCredentials: true,
      headers: this.headers,
    });
  }

  public delete<T>(params: string = ''): Observable<T> {
    this.getIdFromStorage();
    return this.http.delete<T>(`${this.URL}/api/v1/${params}`, {
      withCredentials: true,
      headers: this.headers,
    });
  }
}
