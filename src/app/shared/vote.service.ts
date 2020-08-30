import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { VotePayLoad } from './vote-button/vote-payload';
import { environment } from '../../environments/environment';
@Injectable({
  providedIn: 'root',
})
export class VoteService {
  constructor(private http: HttpClient) {}

  vote(votePayLoad: VotePayLoad): Observable<any> {
    return this.http.post(environment.apiUrl + 'api/vote', votePayLoad);
  }
}
