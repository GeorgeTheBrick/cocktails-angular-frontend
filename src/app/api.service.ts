import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ApiService {
  constructor(private http: HttpClient) {}

  public get<T>(): Observable<T> {
    return this.http.get<T>(
      'https://cocktails-a38b3-default-rtdb.europe-west1.firebasedatabase.app/cocktails.json'
    );
  }
}
