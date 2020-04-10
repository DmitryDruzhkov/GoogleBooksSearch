import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap, finalize } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private api = 'https://www.googleapis.com/books/v1/volumes';
  private startIndex = 0;
  private maxResults = 10;

  constructor(private http: HttpClient) { }

  getVideoList(query): Observable<any> {
    const httpParams: {[param: string]: string | string[]} = {
      q: query,
      startIndex: this.startIndex.toString(),
      maxResults: this.maxResults.toString()
    };

    return this.http.get(`${this.api}`, {params: httpParams}).pipe(
      finalize(() => this.startIndex += this.maxResults)
    );
  }
}
