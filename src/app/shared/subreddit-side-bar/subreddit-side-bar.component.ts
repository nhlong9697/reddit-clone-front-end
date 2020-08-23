import { Component, OnInit } from '@angular/core';
import { SubredditService } from '../../subreddit/subreddit.service';
import { SubredditModel } from 'src/app/subreddit/subreddit-response';
import { Router } from '@angular/router';
@Component({
  selector: 'app-subreddit-side-bar',
  templateUrl: './subreddit-side-bar.component.html',
  styleUrls: ['./subreddit-side-bar.component.css'],
})
export class SubredditSideBarComponent implements OnInit {
  subreddits: Array<SubredditModel>;
  displayViewAll: boolean;
  constructor(
    private subredditService: SubredditService,
    private router: Router
  ) {
    this.subredditService.getAllSubreddit().subscribe((data) => {
      if (data.length > 4) {
        this.subreddits = data.splice(0, 3);
        this.displayViewAll = true;
      } else {
        this.subreddits = data;
      }
    });
  }

  ngOnInit(): void {}
}
