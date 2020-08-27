import { Component, OnInit, Input } from '@angular/core';
import { PostModel } from '../post-model';
import { faArrowUp, faArrowDown } from '@fortawesome/free-solid-svg-icons';
import { VotePayLoad } from './vote-payload';
import { VoteType } from './vote-type';
import { VoteService } from '../vote.service';
import { AuthService } from 'src/app/auth/shared/auth.service';
import { ToastrService } from 'ngx-toastr';
import { error } from '@angular/compiler/src/util';
import { throwError } from 'rxjs';
import { PostService } from '../post.service';
@Component({
  selector: 'app-vote-button',
  templateUrl: './vote-button.component.html',
  styleUrls: ['./vote-button.component.css'],
})
export class VoteButtonComponent implements OnInit {
  @Input() post: PostModel;
  votePayLoad: VotePayLoad;
  upvoteColor = '';
  downvoteColor = '';
  faArrowUp = faArrowUp;
  faArrowDown = faArrowDown;

  constructor(
    private voteService: VoteService,
    private authService: AuthService,
    private postService: PostService,
    private toastr: ToastrService
  ) {
    this.votePayLoad = {
      voteType: undefined,
      postId: undefined,
    };
  }

  ngOnInit(): void {}

  upvotePost() {
    this.votePayLoad.voteType = VoteType.UPVOTE;
    this.vote();
  }

  downvotePost() {
    this.votePayLoad.voteType = VoteType.DOWNVOTE;
    this.vote();
  }

  private vote() {
    this.votePayLoad.postId = this.post.id;
    this.voteService.vote(this.votePayLoad).subscribe(
      () => {
        this.updateVoteDetails();
      },
      (error) => {
        this.toastr.error(error.error.message);
        throwError(error);
      }
    );
  }

  private updateVoteDetails() {
    this.postService.getPost(this.post.id).subscribe((post) => {
      this.post = post;
    });
  }
}
