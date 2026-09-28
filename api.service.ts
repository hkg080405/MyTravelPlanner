import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
} )
export class ApiService {
  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient ) {}

  getTrips(): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.apiUrl}/trips`
     );
  }

  getActivities(): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.apiUrl}/activities`
     );
  }

  createTrip(trip: {
    destination: string;
    startDate: string;
    endDate: string;
    status: string;
  }): Observable<any> {
    return this.http.post<any>(
      `${this.apiUrl}/trips`,
      trip
     );
  }

  createActivity(activity: {
    name: string;
    location: string;
    date: string;
    category: string;
    status: string;
  }): Observable<any> {
    return this.http.post<any>(
      `${this.apiUrl}/activities`,
      activity
     );
  }

  updateTrip(
    id: number,
    trip: {
      destination: string;
      startDate: string;
      endDate: string;
      status: string;
    }
  ): Observable<any> {
    return this.http.put<any>(
      `${this.apiUrl}/trips/${id}`,
      trip
     );
  }

  updateActivity(
    id: number,
    activity: {
      name: string;
      location: string;
      date: string;
      category: string;
      status: string;
    }
  ): Observable<any> {
    return this.http.put<any>(
      `${this.apiUrl}/activities/${id}`,
      activity
     );
  }

  deleteTrip(id: number): Observable<any> {
    return this.http.delete<any>(
      `${this.apiUrl}/trips/${id}`
     );
  }

  deleteActivity(id: number): Observable<any> {
    return this.http.delete<any>(
      `${this.apiUrl}/activities/${id}`
     );
  }
}
