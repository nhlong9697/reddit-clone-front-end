import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SubredditModel } from './subreddit-response';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SubredditService {
  constructor(private http: HttpClient) {}

  getAllSubreddit(): Observable<Array<SubredditModel>> {
    return this.http.get<Array<SubredditModel>>(
      'http://localhost:8080/api/subreddit'
    );
  }

  createSubreddit(subredditModel: SubredditModel): Observable<SubredditModel> {
    console.log(subredditModel);
    return this.http.post<SubredditModel>(
      'http://localhost:8080/api/subreddit',
      subredditModel
    );
  }
}