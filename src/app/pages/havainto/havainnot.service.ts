import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Havainto } from './havainto.model';
import { environment } from 'src/environments/environment';

const BACKEND_URL = environment.apiURL + '/havainnot/';

@Injectable({ providedIn: 'root' })
export class HavainnotService {
  private havainnot: Havainto[] = [];
  private havainnotUpdated = new Subject<Havainto[]>();

  constructor(private http: HttpClient, private router: Router) {}

  addHavainto(havainto: Havainto) {
    this.http
      .post<{ message: string; postId: string }>(BACKEND_URL, havainto)
      .subscribe((responseData) => {
        const postId = responseData.postId;
        havainto.id = postId;
        this.havainnot.push(havainto);
        this.havainnotUpdated.next([...this.havainnot]);
        this.router.navigate(['/']);
      });
  }
  getHavaintoUpdateListener() {
    return this.havainnotUpdated.asObservable();
  }

  getAllHavainnot() {
    this.http
      .get<{ message: string; posts: any }>(BACKEND_URL)
      .pipe(
        map((postData) => {
          return postData.posts.map(
            (post: {
              laji: any;
              maara: any;
              paikkakunta: any;
              info: any;
              date: any;
              osoite: any;
              _id: any;
            }) => {
              return {
                laji: post.laji,
                maara: post.maara,
                paikkakunta: post.paikkakunta,
                info: post.info,
                date: post.date,
                osoite: post.osoite,
                id: post._id,
              };
            }
          );
        })
      )
      .subscribe((transposts) => {
        this.havainnot = transposts;
        this.havainnotUpdated.next([...this.havainnot]);
      });
  }

  getHavainnot(date: string | null | undefined) {
    this.http
      .get<{ message: string; posts: any }>(BACKEND_URL + date)
      .pipe(
        map((postData) => {
          return postData.posts.map(
            (post: {
              laji: any;
              maara: any;
              paikkakunta: any;
              info: any;
              date: any;
              osoite: any;
              _id: any;
            }) => {
              return {
                laji: post.laji,
                maara: post.maara,
                paikkakunta: post.paikkakunta,
                info: post.info,
                date: post.date,
                osoite: post.osoite,
                id: post._id,
              };
            }
          );
        })
      )
      .subscribe((transposts) => {
        this.havainnot = transposts;
        this.havainnotUpdated.next([...this.havainnot]);
      });
  }

  deletePost(postId: string) {
    this.http.delete(BACKEND_URL + postId).subscribe(() => {
      const updatedHavainnot = this.havainnot.filter(
        (post) => post.id !== postId
      );
      this.havainnot = updatedHavainnot;
      this.havainnotUpdated.next([...this.havainnot]);
    });
  }
}
