import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { VotePayLoad } from './vote-button/vote-payload';
@Injectable({
  providedIn: 'root',
})
export class VoteService {
  constructor(private http: HttpClient) {}

  vote(votePayLoad: VotePayLoad): Observable<any> {
    return this.http.post('http://localhost:8080/api/vote', votePayLoad);
  }
}
