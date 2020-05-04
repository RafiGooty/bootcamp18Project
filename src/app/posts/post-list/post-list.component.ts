import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { PostsService } from '../posts.service';
import{Post} from '../post.model'
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import { PageEvent } from '@angular/material/paginator';



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

  totalPosts:number=100;
  postsperPage:number=2;
  pageSizeOption:number[]=[1,2,5,10];
  currentPage:number=1;

  constructor(private postsServices:PostsService,private authService:AuthService) { }

  ngOnInit(): void {
    this.postsServices.getPosts(this.postsperPage,this.currentPage);
    this.postsSub= this.postsServices.getPostUpdateListtner().subscribe((postData:{post:Post[],totalPages})=>{
                    this.posts=postData.post;
                    this.totalPosts=postData.totalPages;
                   });
   this.isAuthorized= this.authService.getIsAuthorized();
   this.authorizationSub=this.authService.getAuthroizationlistner().subscribe(isAuthorized=>{this.isAuthorized=isAuthorized
                  }
    )
    this.userId=this.authService.getUserId();
    this.userIdSub=this.authService.getUserIdlistner().subscribe(userId=>{
      this.userId=userId;
    })


  }

  ngOnDestroy(){
    this.postsSub.unsubscribe();
    this.authorizationSub.unsubscribe();
    this.userIdSub.unsubscribe();
  }

  onDelete(postid:string){
  this.postsServices.deletePost(postid).subscribe(deleted=>{
    this.postsServices.getPosts(this.postsperPage,this.currentPage);
  });
  }

  onChangePage(event:PageEvent){
    console.log(event);
    this.currentPage=event.pageIndex +1;
    this.postsperPage=event.pageSize;
    this.postsServices.getPosts(this.postsperPage,this.currentPage);
  }

}
