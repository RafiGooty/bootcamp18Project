import { Injectable } from '@angular/core';
import {Post} from './post.model'
import {HttpClient} from '@angular/common/http';
import {Subject} from 'rxjs';
import { map } from 'rxjs/operators';
import {Router} from '@angular/router'
import {environment} from '../../environments/environment'

const BACKEND_URL= environment.apiUrl+ "/data/";

@Injectable({
  providedIn: 'root'
})
export class PostsService {
public posts:Post[]=[];
private postsUpdated= new Subject<{post:Post[],totalPages:number}>();

  constructor(private http:HttpClient,private router:Router) { }
  getPosts(pageSize:number,currentPage:number){
      let queryParams=`?pages=${pageSize}&currentPage=${currentPage}`;
      console.log(queryParams);
      this.http.get<{message:string,posts:any,totalPages:number}>
      (BACKEND_URL+ queryParams)
      .pipe(map(rowData=>{ return { posts:rowData.posts.map( postData=>
                                          { return {  id      : postData._id,
                                                      title   : postData.title,
                                                      content : postData.content,
                                                      imageUrl: postData.imageUrl,
                                                      creator:  postData.creator
                                                    }
                                          }),
                                    totalPages:rowData.totalPages
                            }
                          }))
      .subscribe((data)=>{
        console.log(data,"get all");
           this.posts= data.posts;
           this.postsUpdated.next({post:[...this.posts],totalPages:data.totalPages})
    });
  }

  getPostUpdateListtner(){
    return this.postsUpdated.asObservable();
  }

  addPost(  id      :string,
            title   :string,
            content :string,
            image   :File
          ){

    let post :Post={ id     :null,
                    title   :title,
                    content :content,
                    imageUrl:null,
                    creator:null
                  }
    let postFormData= new FormData();

    postFormData.append("title",title);
    postFormData.append("content",content);
    postFormData.append("image",image,title);

    this.http.post<{message:string,post:Post}>
    (BACKEND_URL,postFormData)
    .subscribe((responseData)=>
                                {
                                    // post.id=responseData.post.id;
                                    // post.imageUrl=responseData.post.imageUrl;
                                    // this.posts.push(post);
                                    // this.postsUpdated.next(this.posts);
                                    this.router.navigate(["/"]);
                                }
              )
  }

  editPost( id      :string,
            title   :string,
            content :string,
            image   :File|string
          ){
    let postFormData:Post|FormData;
    if(typeof(image)==="object"){
      postFormData=new FormData();
      postFormData.append('title',title);
      postFormData.append('content',content);
      postFormData.append('image',image,title);
    } else {
              postFormData ={
                              id:id,
                              title:title,
                              content:content,
                              imageUrl:image,
                              creator:null
                            }
            }
    let post :any={id:id,title:title,content:content}
    this.http.put<{message:string,id:string}>
    (BACKEND_URL +id,postFormData)
    .subscribe(responseData=>{
      //const post=this.posts this.posts.findIndex(val=>val['id']===responseData.id);
      console.log("update Scusscfull");
      this.router.navigate(["/"]);
    })
  }


  editData(postId:string)
  {
   // return {...this.posts.find(post=>post.id===postId)};
   return this.http.get<{message:string,post:Post}>
   (BACKEND_URL +postId)
  }

  deletePost(postID:string){
    return this.http.delete(BACKEND_URL + postID);
    // .subscribe(()=>{
    //   console.log("hellow")
    //  const updateDeleted=this.posts.filter(post=> post.id !=postID);
    //   this.posts=updateDeleted;
    //   this.postsUpdated.next(this.posts);
    // })
  }
}
