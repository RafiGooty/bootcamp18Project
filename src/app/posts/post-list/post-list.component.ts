import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { PostsService } from '../posts.service';
import{Post} from '../post.model'
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { faEdit } from '@fortawesome/free-solid-svg-icons';


@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {

  private postsSub: Subscription;
  private authorizationSub:Subscription;
  private userIdSub:Subscription;

  isAuthorized:boolean=false;
  userId:string;

  faTrashAlt = faTrashAlt;
  faEdit =faEdit;

  posts:Post[]=[];
  imagePath:string;

  constructor(private postsServices:PostsService,private authService:AuthService) { }

  ngOnInit(): void {
    this.postsServices.getPosts();
    this.postsSub= this.postsServices.getPostUpdateListtner().subscribe((data:Post[])=>{
    this.posts=data;
    console.log(this.posts,"list");
     });
    console.log(this.posts);
    console.log(this.postsServices.posts);
   this.isAuthorized= this.authService.getIsAuthorized();
   this.authorizationSub=this.authService.getAuthroizationlistner().subscribe(isAuthorized=>{this.isAuthorized=isAuthorized
                  }
    )

    this.userIdSub=this.authService.getUserIdlistner().subscribe(userId=>{
      this.userId=userId;
    })

    this.userId=this.authService.getUserId();
  }

  ngOnDestroy(){
    this.postsSub.unsubscribe();
    this.authorizationSub.unsubscribe();
  }

  onDelete(postid:string){
  this.postsServices.deletePost(postid);
  }



}
