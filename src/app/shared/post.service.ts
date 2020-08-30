import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PostModel } from './post-model';
import { CreatePostPayload } from '../post/create-post/create-post.payload';
import { environment } from '../../environments/environment';
@Injectable({
  providedIn: 'root',
})
export class PostService {
  constructor(private http: HttpClient) {}

  getAllPosts(): Observable<Array<PostModel>> {
    return this.http.get<Array<PostModel>>(environment.apiUrl + 'api/posts/');
  }

  createPost(postPayLoad: CreatePostPayload): Observable<any> {
    return this.http.post(environment.apiUrl + 'api/posts/', postPayLoad);
  }

  getPost(id: number): Observable<PostModel> {
    return this.http.get<PostModel>(environment.apiUrl + 'api/posts/' + id);
  }

  getAllPostsByUser(name: string): Observable<PostModel[]> {
    return this.http.get<PostModel[]>(
      environment.apiUrl + 'api/posts/by-user/' + name
    );
  }
}
