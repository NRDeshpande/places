import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';
import { Router } from '@angular/router';

export interface UserDetails {
  _id: string;
  email: string;
  name: string;
  exp: number;
  iat: number;
}

export interface NewPlaceDetails {
  name: string;
  description: string;
  address: string;
  file: File;
  userName: string;
  userId: string;
}

interface TokenResponse {
  token: string;
}

export interface TokenPayload {
  email: string;
  password: string;
  name?: string;
}

@Injectable()
export class AuthenticationService {
  private token: string;

  constructor(private http: HttpClient, private router: Router) {}

  private saveToken(token: string): void {
    localStorage.setItem('mean-token', token);
    this.token = token;
  }

  private getToken(): string {
    if (!this.token) {
      this.token = localStorage.getItem('mean-token');
    }
    return this.token;
  }

  public getUserDetails(): UserDetails {
    const token = this.getToken();
    let payload;
    if (token) {
      payload = token.split('.')[1];
      payload = window.atob(payload);
      return JSON.parse(payload);
    } else {
      return null;
    }
  }

  public isLoggedIn(): boolean {
    const user = this.getUserDetails();
    if (user) {
      return user.exp > Date.now() / 1000;
    } else {
      return false;
    }
  }

  private request(method: 'post'|'get', type, data?): Observable<any> {
    let base;

    if (method === 'post') {
      base = this.http.post('http://localhost:1234/api/'+`${type}`, data);
    } else {
      base = this.http.get('http://localhost:1234/api/'+`${type}`, { headers: { Authorization: `Bearer ${this.getToken()}`, "Content-Type": "application/json" }});
    }

    const request = base.pipe(
      map((data: TokenResponse) => {
        if (data.token) {
          this.saveToken(data.token);
        }
        return data;
      })
    );

    return request;
  }

  public register(user: TokenPayload): Observable<any> {
    return this.request('post', 'register', user);
  }

  public login(user: TokenPayload): Observable<any> {
    return this.request('post', 'login', user);
  }

  public profile(): Observable<any> {
    return this.request('get', 'profile');
  }

  public saveNewPlace(placeDetails): Observable<any>{
    return this.request('post', 'saveNewPlace', placeDetails);
  }

  public placeList(): Observable<any> {
    return this.request('get', 'places');
  }

  public deletPlace(_id): Observable<any> {
    return this.request('post', 'deletePlace', {'_id': _id});
  }

  public getPlaceDetail(_id): Observable<any> {
    return this.request('get', 'placeDetail/'+_id);
  }

  public logout(): void {
    this.token = '';
    window.localStorage.removeItem('mean-token');
    this.router.navigateByUrl('/');
  }
}